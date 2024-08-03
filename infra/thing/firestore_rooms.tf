// Create artist rooms for testing.

locals {
  rooms = {
    soft = {
      room_color : "#DAF4FF",
    },
    chrisy = {
      room_color : "#13FF2B"
    }
  }
}

resource "google_firestore_document" "artist_rooms" {
  for_each = tomap(local.rooms)
  project  = google_project.main.project_id
  database = google_firestore_database.main.name

  collection  = "rooms"
  document_id = each.key

  // Ignore changes to the fields that are done manually within the Firebase UI.
  lifecycle {
    ignore_changes = ["fields"]
  }

  fields = jsonencode({
    "hidden": { "booleanValue": false },
    "admins" : { "arrayValue" : { "values" : [] } },
    "room_color" : { "stringValue" : each.value.room_color },
    "room_name" : { "stringValue" : each.key },
    "stream_status" : { "stringValue" : "test" },
  })
}
