import {
    FlightType,
    Flight
} from "./types.js";

import {
    logicalFlights,
    standardFlights
} from "./flights.js";

import {
    getFlightFromQuery,
    setCalled,
    unsetCalled,
    getLocalStorage,
    redirect
} from "./helpers.js";

async function main() {
    // @ts-ignore
    chrome.omnibox.onInputEntered.addListener(async (text, OnInputEnteredDisposition) => {
        const query = text.split(" ");
        if(query[0] === "set"){
            console.log("a");
            await setCalled(query);
        } else if (query[0] === "unset") {
            await unsetCalled(query);
        } else {
            const flight = getFlightFromQuery(query);
            if(flight.type == FlightType.LOGICAL){
                switch(flight.identifier){
                    case "gh":
                        await goToGithub(flight);
                        break;
                    default:
                        await handleFlight(flight);
                        break;
                }
            } else {
                await handleFlight(flight);
            }
        }

    });
}

async function goToGithub(flight: Flight){
    if(flight.values !== undefined && flight.values.length === 2) {
        return await handleFlight(flight);
    }

    try {
        let org = await getLocalStorage("gh-org");
        let values: string[] = [];
        if(flight.values !== undefined){
            values = flight.values;
        }
        const newFlight: Flight = {
            type: flight.type,
            identifier: flight.identifier,
            override: flight.override,
            values: [org, ...values]
        }
        await handleFlight(newFlight);
    } catch {
        const newFlight: Flight = {
            type: FlightType.STANDARD,
            identifier: "config-github/org-not-set"
        };
        await handleFlight(newFlight);
    }
}

async function handleStandardFlight(flight: Flight){
    for(let key in standardFlights){
        for(let value of standardFlights[key]){
            if(value === flight.identifier){
                return await redirect(`Following Link`, key);
            }
        }
    }

    await redirect("Not a standard flight", "https://github.com/Apollorion/fly");
}

async function handleFlight(flight: Flight){

    if(flight.type === FlightType.LOGICAL && flight.values !== undefined) {
        if (flight.identifier in logicalFlights) {
            let flightDetails = logicalFlights[flight.identifier];

            if(flight.values.length === 0){
                if(flight.override !== undefined) {
                    return await redirect("override flight", flight.override);
                } else {
                    return await redirect("Incorrect Length", "https://github.com/Apollorion/fly/blob/main/help/logical-logicalFlights.md#incorrect-length");
                }
            }

            let link = flightDetails["logic"];
            let i = 1;
            for (let item of flight.values) {
                link = link.replace(`$${i}`, item);
                i++;
            }

            return await redirect(`Following Link`, link);

        } else {
            return await redirect("Logic Not Found", "https://github.com/Apollorion/fly/blob/main/help/logical-logicalFlights.md#logic-not-found");
        }
    } else {
        return await handleStandardFlight(flight);
    }

}

main().then(()=>{
    console.log("Finished");
});