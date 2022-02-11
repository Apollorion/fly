provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket = "apollorion-us-east-1-tfstates"
    key    = "fly.apollorion.com.tfstate"
    region = "us-east-1"
  }
}

data "aws_acm_certificate" "main" {
  domain      = local.tld
  statuses    = ["ISSUED"]
  types       = ["AMAZON_ISSUED"]
  most_recent = true
}

locals {
  tld = "fly.apollorion.com"
}