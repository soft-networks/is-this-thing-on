locals {
  chrisy_stickers = {
    hair1 = {
      size = "0.3",
      url  = "https://i6.cims.nyu.edu/~mr6465/chrisy/hair1.png",
    },
    hair2 = {
      size = "0.3",
      url  = "https://i6.cims.nyu.edu/~mr6465/chrisy/hair2.png",
    },
    hair3 = {
      size = "0.24",
      url  = "https://i6.cims.nyu.edu/~mr6465/chrisy/hair3.png",
    },
    hair4 = {
      size = "0.57",
      url  = "https://i6.cims.nyu.edu/~mr6465/chrisy/hair4.png",
    },
  }
}

resource "google_firestore_document" "chrisy" {
  project  = google_project.main.project_id
  database = google_firestore_database.main.name

  collection  = "rooms"
  document_id = "chrisy"

  // Ignore changes to the fields that are done manually within the Firebase UI.
  lifecycle {
    ignore_changes = ["fields"]
  }

  fields = jsonencode({
    "admins" : { "arrayValue" : { "values" : [] } },
    "room_color" : { "stringValue" : "#13FF2B" },
    "room_name" : { "stringValue" : "chrisy" },
    "stream_status" : { "stringValue" : "test" },
  })
}

resource "google_firestore_document" "chrisy_stickers" {
  for_each = tomap(local.chrisy_stickers)
  project  = google_project.main.project_id
  database = google_firestore_database.main.name

  collection  = "${google_firestore_document.chrisy.path}/sticker_cdn"
  document_id = each.key

  // Ignore changes to the fields that are done manually within the Firebase UI.
  lifecycle {
    ignore_changes = ["fields"]
  }

  fields = jsonencode({
    "size" : { "stringValue" : each.value.size }
    "url" : { "stringValue" : each.value.url },
  })
}
