// Sets up a multi-region firestore database for use with THING.
//
// Named databases + point-in-time recovery are paid features and 
// therefore disabled by default. Authentication must be set up 
// outside of terraform to avoid billing setup.

locals {
  database_name                  = "(default)"
  point_in_time_recovery_enabled = false
}

# Enable required APIs for Cloud Firestore.
resource "google_project_service" "firestore" {
  for_each = toset([
    "firestore.googleapis.com",
    "firebaserules.googleapis.com",
  ])

  service = each.key
  project = google_firebase_project.thing.project

  # Don't disable the service if the resource block is removed by accident.
  disable_on_destroy = false
}

resource "google_firestore_database" "main" {
  project                           = google_firebase_project.thing.project
  name                              = local.database_name
  location_id                       = "nam5"
  type                              = "FIRESTORE_NATIVE"
  concurrency_mode                  = "OPTIMISTIC"
  app_engine_integration_mode       = "DISABLED"
  point_in_time_recovery_enablement = local.point_in_time_recovery_enabled ? "POINT_IN_TIME_RECOVERY_ENABLED" : "POINT_IN_TIME_RECOVERY_DISABLED"
  delete_protection_state           = "DELETE_PROTECTION_ENABLED"
  deletion_policy                   = "DELETE"

  # Wait for Firestore to be enabled.
  depends_on = [google_project_service.firestore]
}

# Create a ruleset of Firestore Security Rules from a local file.
resource "google_firebaserules_ruleset" "firestore" {
  project = google_firebase_project.thing.project
  source {
    files {
      name    = "firestore.rules"
      content = file("../firestore.rules")
    }
  }

  # Wait for Firestore to be provisioned before creating this ruleset.
  depends_on = [
    google_firestore_database.main,
  ]
}

resource "google_firebaserules_release" "firestore" {
  name         = "cloud.firestore"
  ruleset_name = google_firebaserules_ruleset.firestore.name
  project      = google_firebase_project.thing.project

  depends_on = [
    google_firestore_database.main,
  ]

  lifecycle {
    replace_triggered_by = [
      google_firebaserules_ruleset.firestore
    ]
  }
}
