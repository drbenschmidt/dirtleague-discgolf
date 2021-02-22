terraform {
  backend "s3" {
    region  = "us-east-1"
    bucket  = "dirtleague-terraform-states"
    encrypt = true
    key     = "infra/terraform.tfstate"
  }
}
