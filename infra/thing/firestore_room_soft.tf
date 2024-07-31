resource "google_firestore_document" "soft" {
  project  = google_project.main.project_id
  database = google_firestore_database.main.name

  collection  = "rooms"
  document_id = "soft"

  // Ignore changes to the fields that are done manually within the Firebase UI.
  lifecycle {
    ignore_changes = ["fields"]
  }

  fields = jsonencode({
    "admins" : { "arrayValue" : { "values" : [] } },
    "room_color" : { "stringValue" : "#DAF4FF" },
    "room_name" : { "stringValue" : "soft" },
    "stream_status" : { "stringValue" : "test" },
  })
}