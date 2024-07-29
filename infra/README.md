# Infrastructure

This directory allows you to reproduce a Firebase project that can support your own instance of THING. The Firebase project is set up on a free tier and inserts a few rooms into the database for use.

Note that this stores your terraform state in a local file.

## Requirements

You will need the following tools for running this infrastructure:

- [Terraform](https://developer.hashicorp.com/terraform/install)
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
- Python 3.8 ~ 3.12 (Required for Google Cloud CLI)

For terraform and python, I recommend installing and utilizing an all-in-one version manager like [asdf](https://asdf-vm.com/), which is already configured in this folder.

```sh
# Run this within /infra to install terraform and python
asdf install

# Shim asdf so the terraform and python commands are available everywhere
asdf reshim
```

## 1. Bootstrap the Infrastructure

You must be logged into Google Cloud on the command line before attempting to bootstrap the Firebase project.

```sh
gcloud auth application-default login
```

Once you have successfully logged in, you can run the following command to create a new Firebase project with a required custom name.

```sh
# Run this within /infra/thing
terraform apply --var project_name=isto-test
```

This should create all the required resources in your Google Cloud account. It will also generate an .env.local file in the [client](/client) folder, which is automatically read by Next.js when starting the application.

## 2. Enable Authentication

To avoid billing setup within Google Cloud, authentication is not enabled through Terraform. You must go to the Google Cloud UI and manually enable Email/Password authentication.

## Destroying your Firebase Project

If you'd like to destroy your Firebase project, you can run the following command using your custom project name:

```sh
terraform destroy --var project_name=isto-test
```
