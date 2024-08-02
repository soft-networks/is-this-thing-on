// Set up required document collection indexes for firestore.

resource "google_firestore_index" "chat_roomid" {
  project    = google_firebase_project.thing.project
  database   = google_firestore_database.main.name
  collection = "chat"

  fields {
    field_path = "roomID"
    order      = "ASCENDING"
  }

  fields {
    field_path = "timestamp"
    order      = "DESCENDING"
  }

  fields {
    field_path = "__name__"
    order      = "DESCENDING"
  }
}

resource "google_firestore_index" "presence_roomid" {
  project    = google_firebase_project.thing.project
  database   = google_firestore_database.main.name
  collection = "presence"

  fields {
    field_path = "room_id"
    order      = "ASCENDING"
  }

  fields {
    field_path = "timestamp"
    order      = "ASCENDING"
  }

  fields {
    field_path = "__name__"
    order      = "ASCENDING"
  }
}

resource "google_firestore_index" "energy_transactions_status" {
  project    = google_firebase_project.thing.project
  database   = google_firestore_database.main.name
  collection = "energy_transactions"

  fields {
    field_path = "status"
    order      = "ASCENDING"
  }

  fields {
    field_path = "timestamp"
    order      = "ASCENDING"
  }

  fields {
    field_path = "__name__"
    order      = "ASCENDING"
  }
}

resource "google_firestore_index" "rooms_admins_hidden" {
  project    = google_firebase_project.thing.project
  database   = google_firestore_database.main.name
  collection = "rooms"

  fields {
    field_path = "admins"
    array_config = "CONTAINS"
  }

  fields {
    field_path = "hidden"
    order      = "ASCENDING"
  }

  fields {
    field_path = "__name__"
    order      = "ASCENDING"
  }
}
