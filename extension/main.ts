import {
    FlightType,
    Flight
} from "./types.js";

import {
    getFlightFromQuery,
    setCalled,
    unsetCalled,
    redirect,
    checkRepoFlights,
    getNewFlightResponseSynchronous,
    repoManagement
} from "./helpers.js";

import {getLocalStorage } from "./localstorage.js";

export async function main() {
    // @ts-ignore
    chrome.omnibox.onInputEntered.addListener(async (text, OnInputEnteredDisposition) => {
        const query = text.split(" ");
        if(query[0] === "set"){
            await setCalled(query);
        } else if (query[0] === "unset") {
            await unsetCalled(query);
        } else if (query[0] === "repo") {
            let resp = await repoManagement(query);
            console.log(resp);
        } else {
            const repoFlightResponse = await checkRepoFlights();
            const flight = await getFlightFromQuery(query, repoFlightResponse);
            await handleFlight(flight);
        }
    });
}

export async function handleStandardFlight(flight: Flight){
    const repoFlightResponse = await checkRepoFlights();
    let newFlights = getNewFlightResponseSynchronous(repoFlightResponse);
    const newStandardFlights = newFlights.standard;

    for(let key in newStandardFlights){
        for(let value of newStandardFlights[key]){
            if(value === flight.identifier){
                return await redirect(`Following Link`, key);
            }
        }
    }

    await redirect("Not a standard flight", "https://github.com/Apollorion/fly");
}

export async function handleFlight(flight: Flight){
    const repoFlightResponse = await checkRepoFlights();
    let newFlights = getNewFlightResponseSynchronous(repoFlightResponse);
    const newLogicalFlights = newFlights.logical;

    if(flight.type === FlightType.LOGICAL && flight.values !== undefined) {
        if (flight.identifier in newLogicalFlights) {
            let flightDetails = newLogicalFlights[flight.identifier];
            let logic = flightDetails["logic"];

            // Regex that match everything inside ${}
            let regex = /\${([^}]*)}/g;
            let matches = logic.match(regex);

            if(matches === null) {
                console.log("Matches is null");

            // If the length of matches and the flight values are the same
            // The user wants to supply all the values
            } else if (matches.length === flight.values.length) {
                let i = 0;
                for(let match of matches){
                    const value = flight.values[i];
                    if(value !== undefined) {
                        logic = logic.replace(match, value);
                        i++;
                    }
                }

            } else {
                for(let match of matches){
                    try {
                        const matchNoBrackets = match.replace("${", "").replace("}", "");
                        const value = await getLocalStorage(matchNoBrackets);
                        if(value !== undefined) {
                            logic = logic.replace(match, value);

                            // Remove the item from the array, so we can replace using the values of the flight later
                            const index = matches.indexOf(match);
                            if (index > -1) {
                                matches.splice(index, 1); // 2nd parameter means remove one item only
                            }
                        }
                    } catch {
                        console.log("Could not find value for: " + match);
                    }
                }

                // If there are still matches left, we will treat them as positional variables
                let i = 0;
                for(let match of matches){
                    const value = flight.values[i];
                    if(value !== undefined) {
                        logic = logic.replace(match, value);
                        i++;
                    }
                }
            }

            if(logic.includes("${") && logic.includes("}")){
                if(flight.override !== undefined) {
                    return await redirect("override flight", flight.override);
                } else {
                    return await redirect("Incorrect Length", "https://github.com/Apollorion/fly/blob/main/help/logical-logicalFlights.md#incorrect-length");
                }
            } else {
                return await redirect("Following Link", logic);
            }

        } else {
            return await redirect("Logic Not Found", "https://github.com/Apollorion/fly/blob/main/help/logical-logicalFlights.md#logic-not-found");
        }
    } else {
        return await handleStandardFlight(flight);
    }

}