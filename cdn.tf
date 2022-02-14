locals {
  github_url = "https://github.com/apollorion/fly"
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
    response_page_path    = "/404.html"
    error_caching_min_ttl = 86400
  }]
}

locals {
  links_to_map = merge(values({ for key, value in local.links : key => { for link in value : link => key } })...)
}

resource "aws_s3_bucket_object" "websitefiles" {
  for_each         = local.links_to_map
  bucket           = module.cdn.s3_bucket
  key              = each.key
  source           = ""
  acl              = "public-read"
  content_type     = "text/html"
  etag             = md5("${each.key}.${each.value}")
  website_redirect = each.value
  tags             = {}
}

resource "aws_s3_bucket_object" "index" {
  bucket           = module.cdn.s3_bucket
  key              = "index.html"
  content          = ""
  acl              = "public-read"
  content_type     = "text/html"
  etag             = md5("https://github.com/apollorion/fly")
  website_redirect = local.github_url
  tags             = {}
}

resource "aws_s3_bucket_object" "four-oh-four" {
  bucket       = module.cdn.s3_bucket
  key          = "404.html"
  content      = "<html><head><meta http-equiv=\"refresh\" content=\"0; URL=${local.github_url}\"/></head></html>"
  acl          = "public-read"
  content_type = "text/html"
  etag         = md5("https://github.com/apollorion/fly")
  tags         = {}
}

output "links" {
  value = local.links_to_map
}