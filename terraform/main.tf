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

data "aws_route53_zone" "fly" {
  name = local.tld
}

module "cdn" {
  source  = "cloudposse/cloudfront-s3-cdn/aws"
  version = "0.40.0"

  aliases             = [local.tld]
  acm_certificate_arn = data.aws_acm_certificate.main.arn
  allowed_methods     = ["HEAD", "GET"]
  name                = local.tld
  parent_zone_id      = data.aws_route53_zone.fly.zone_id
  dns_alias_enabled   = true
  website_enabled     = true

  custom_error_response = [{
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 86400
  }]
}

resource "aws_s3_bucket_object" "index" {
  bucket           = module.cdn.s3_bucket
  key              = "index.html"
  content          = ""
  acl              = "public-read"
  content_type     = "text/html"
  etag             = md5("https://github.com/apollorion/fly")
  website_redirect = "https://github.com/apollorion/fly"
  tags             = {}
}