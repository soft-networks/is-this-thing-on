// Output an .env.local file for the client application.
// These variables are utilized within the client browser and are 
// therefore public / non-secret Next.js variables.

resource "local_file" "foo" {
  filename = "${path.module}/../../client/.env.local"
  content  = <<EOF
NEXT_PUBLIC_USE_PROD_SERVER=false
NEXT_PUBLIC_PROJECT_ID=${google_firebase_project.thing.project}
NEXT_PUBLIC_APP_ID=${google_firebase_web_app.client.app_id}
NEXT_PUBLIC_API_KEY=${data.google_firebase_web_app_config.client.api_key}
NEXT_PUBLIC_AUTH_DOMAIN=${data.google_firebase_web_app_config.client.auth_domain}
NEXT_PUBLIC_DATABASE_URL=${lookup(data.google_firebase_web_app_config.client, "database_url", "")}
NEXT_PUBLIC_STORAGE_BUCKET=${lookup(data.google_firebase_web_app_config.client, "storage_bucket", "")}
NEXT_PUBLIC_MESSAGING_SENDER_ID=${lookup(data.google_firebase_web_app_config.client, "messaging_sender_id", "")}
EOF
}
