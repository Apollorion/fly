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


  # Logical links are always going to return a 404 from the CDN (rewritten to 200)
  # A logical link will look like `https://fly.apollorion.com/logical/gh/Apollorion-manifests.io
  # It will match because all logical links begin with `logical`, the directory is `gh` and logic is split off the `-` character.
  # So the logic here is that it will match `gh`, split `Apollorion-manifests.io` into $1 = `Apollorion` and $2 = `manifests.io`
  # For a full URL of `https://github.com/Apollorion/manifests.io`
  logical_links = {
    "gh" : {
      "logic" : "https://github.com/$1/$2"
    }
  }

  # help links that are generated in the extension
  help = {
    "https://github.com/Apollorion/fly/blob/main/help/config-github.md#org-not-set" : ["config-github/org-not-set"],
    "https://github.com/Apollorion/fly/blob/main/help/config-github.md#repo-not-set" : ["config-github/repo-not-set"],
  }
}