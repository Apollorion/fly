locals {
  flights = {
    "https://app.terraform.io/app/" : ["terraform", "tfc"],
    "https://app.datadoghq.com/" : ["datadog", "dd"],
  }

  logical_flights = {
    "gh" : {
      "logic" : "https://github.com/$1/$2",
    },
    "aws" : {
      "logic" : "https://console.aws.amazon.com/console/home?region=$1"
      "default" : "https://console.aws.amazon.com/console/home"
    }
  }

  help = {
    "https://github.com/Apollorion/fly/blob/main/help/config-github.md#org-not-set" : ["config-github/org-not-set"],
    "https://github.com/Apollorion/fly/blob/main/help/config-github.md#repo-not-set" : ["config-github/repo-not-set"],
    "https://github.com/Apollorion/fly/blob/main/help/logical-flights.md#logic-not-found" : ["logical-flights/not-found"]
  }
}