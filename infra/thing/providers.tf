terraform {
  required_version = "~> 1.9"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.38"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.38"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
  }
}

provider "google" {}
provider "google-beta" {}
