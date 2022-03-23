import {LogicalFlightDefinition, StandardFlightDefinition} from "./types.js";

export const logicalFlights: LogicalFlightDefinition = {
    "aws": {
        "override": "https://console.aws.amazon.com/console/home",
        "logic": "https://console.aws.amazon.com/console/home?region=${region}",
    },
    "gh": {
        "logic": "https://github.com/${gh-org}/${repo}",
    },
    "tfc": {
        "override": "https://app.terraform.io/app/",
        "logic": "https://app.terraform.io/app/${tfc-org}/workspaces?search=${tfc-search}"
    }
};

export const standardFlights: StandardFlightDefinition = {
    "https://app.datadoghq.com/" : ["datadog", "dd"],

    "https://github.com/Apollorion/fly/blob/main/help/config-github.md#org-not-set" : ["config-github/org-not-set"],
    "https://github.com/Apollorion/fly/blob/main/help/config-github.md#repo-not-set" : ["config-github/repo-not-set"],
    "https://github.com/Apollorion/fly/blob/main/help/logical-flights.md#logic-not-found" : ["logical-flights/not-found"]
}