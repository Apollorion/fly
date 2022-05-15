import {LogicalFlightDefinition, StandardFlightDefinition} from "./types.js";

export const logicalFlights: LogicalFlightDefinition = {
    "aws": {
        "override": "https://console.aws.amazon.com/console/home",
        "logic": ["https://console.aws.amazon.com/console/home?region=${region:plain}"],
    },
    "gh": {
        "logic": ["https://github.com/${gh-org:plain}/${repo:plain}"],
    },
    "ghcs": {
        "logic": [
            "https://cs.github.com/?scopeName=All+repos&scope=&q=org%3A${ghcs-org:plain}+${ghcs-query:urlencode}",
            "https://cs.github.com/?scopeName=All+repos&scope=&q=${ghcs-query:urlencode}",
        ],
    },
    "tfc": {
        "override": "https://app.terraform.io/app/",
        "logic": ["https://app.terraform.io/app/${tfc-org:plain}/workspaces?search=${tfc-search:plain}"]
    },
    "dd": {
        "override": "https://app.datadoghq.com/",
        "logic": ["https://app.datadoghq.com/${dd-product:plain}"]
    }
};

export const standardFlights: StandardFlightDefinition = {
    // This standard flight is included for testing purposes
    // normally it would be easier to just use the omnibar for google searches
    "https://google.com/": ["google", "go"]
}