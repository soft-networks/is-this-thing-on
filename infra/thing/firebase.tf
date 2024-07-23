resource "google_firebase_project" "thing" {
  provider = google-beta
  project  = google_project.main.project_id

  # Wait until the required APIs are enabled.
  depends_on = [
    google_project_service.firebase,
    google_project_service.serviceusage,
  ]
}

# Create a Firebase Web App in the new project created above.
resource "google_firebase_web_app" "client" {
  provider = google-beta
  project  = google_firebase_project.thing.project

  display_name    = "isto-client"
  deletion_policy = "DELETE"
}

data "google_firebase_web_app_config" "client" {
  provider   = google-beta
  project    = google_firebase_project.thing.project
  web_app_id = google_firebase_web_app.client.app_id
}
