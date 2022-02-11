locals {
  links = {
    "https://console.aws.amazon.com/console/home" : ["aws"],
    "https://console.aws.amazon.com/console/home?region=us-east-1" : ["aws-us-east-1"],
    "https://console.aws.amazon.com/console/home?region=us-east-2" : ["aws-us-east-2"],
    "https://console.aws.amazon.com/console/home?region=us-west-1" : ["aws-us-west-1"],
    "https://console.aws.amazon.com/console/home?region=us-west-2" : ["aws-us-west-2"],
    "https://app.terraform.io/app/" : ["terraform", "tfc"],
    "https://app.datadoghq.com/" : ["datadog", "dd"],
  }
}