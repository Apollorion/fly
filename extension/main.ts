import {
    FlightType,
    Flight, FlightPlans
} from "./types.js";

import {
    getFlightFromQuery,
    setCalled,
    unsetCalled,
    redirect,
    getFlightPlans,
    repoManagement,
    makeType,
    getValue,
    getType,
    getHistory,
    setHistory
} from "./helpers.js";

import {getLocalStorage } from "./localstorage.js";
import SuggestResult = chrome.omnibox.SuggestResult;

export async function main() {
    chrome.omnibox.onInputEntered.addListener(async (text, OnInputEnteredDisposition) => {
        if(chrome.runtime.lastError) {
            console.warn("Whoops.. " + chrome.runtime.lastError.message);
        }

        const query = text.split(" ");
        if(query[0] === "set"){
            await setCalled(query);
        } else if (query[0] === "unset") {
            await unsetCalled(query);
        } else if (query[0] === "repo") {
            let resp = await repoManagement(query);
            console.log(resp);
        } else {
            const history = await getHistory(query);
            setHistory(history).then(async () => {
                const flightPlans = await getFlightPlans();
                const flight = await getFlightFromQuery(query, flightPlans);
                await handleFlight(flight, flightPlans);
            });
        }
    });

    chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
        if(chrome.runtime.lastError) {
            console.warn("Whoops.. " + chrome.runtime.lastError.message);
        }
        const query = text.split(" ");
        if(!["set", "unset", "repo"].includes(query[0])){
            const history = await getHistory([]);
            const initialSuggestions = history.map((item: string) => {
                if (item !== "" && item.toLowerCase().includes(text.toLowerCase())) {
                    return {
                        content: item,
                        description: item
                    };
                }
            });
            const filtered = initialSuggestions.filter(function (x: any) {
                return x !== undefined;
            }) as SuggestResult[];

            if(filtered.length > 0){
                suggest(filtered);
            }
        }
    });
}

export async function handleStandardFlight(flight: Flight, flightPlans: FlightPlans){
    const standardFlightPlans = flightPlans.standard;
    for(let key in standardFlightPlans){
        for(let value of standardFlightPlans[key]){
            if(value === flight.identifier){
                return await redirect(`Following Link`, key);
            }
        }
    }

    // Send user to page defining that the flight was not found
    await redirect("Not a standard flight", "https://github.com/Apollorion/fly/blob/main/help/flight-not-found.md");
}

export async function handleFlight(flight: Flight, flightPlans: FlightPlans): Promise<any> {
    const logicalFlightPlans = flightPlans.logical;

    if(flight.type === FlightType.LOGICAL && flight.values !== undefined) {
        if (flight.identifier in logicalFlightPlans) {
            let flightDetails = logicalFlightPlans[flight.identifier];
            let logics = flightDetails["logic"];

            let highMatches = 0;
            for (let logic of logics) {

                let flightValueCounter = flight.values.length;

                // Regex that match everything inside ${}
                let regex = /\${([^}]*)}/g;
                let matches = logic.match(regex);

                // determine which logic block has the most amount of logic
                if(matches !== null && matches.length > highMatches){
                    highMatches = matches.length;
                }

                if (matches === null) {
                    console.log("Matches is null");
                } else if (matches.length === flight.values.length) {
                    // If the length of matches and the flight values are the same
                    // The user wants to supply all the values
                    let i = 0;
                    for (let match of matches) {
                        const value = flight.values[i];
                        if (value !== undefined) {
                            logic = logic.replace(match, makeType(value, getType(match)));
                            flightValueCounter--;
                            i++;
                        }
                    }

                } else {
                    // If the length of matches and the flight values are not the same
                    // we will check local storage for any saved values
                    for (let match of matches) {
                        try {
                            const matchNoBrackets = getValue(match);
                            const value = await getLocalStorage(matchNoBrackets);
                            if (value !== undefined) {
                                logic = logic.replace(match, makeType(value, getType(match)));

                                //Remove the item from the array, so we can replace using the values of the flight later
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
                    let i = 0
                    for (let match of matches) {
                        const value = flight.values[i];
                        if (value !== undefined) {
                            logic = logic.replace(match, makeType(value, getType(match)));
                            flightValueCounter--;
                            i++;
                        }
                    }
                }

                // If there are no more variables to replace, follow the link
                if (!logic.includes("${") && !logic.includes("}") && flightValueCounter === 0) {
                    return await redirect("Following Link", logic);
                }
            }

            if(flight.values.length > highMatches){
                let lastLogic = logics.at(-1);
                if(lastLogic !== undefined) {
                    let lastOccurrence = lastLogic.lastIndexOf("}");
                    if (lastLogic.substring(lastOccurrence - 9, lastOccurrence) === "urlencode") {
                        flight.values = [flight.values.join(" ")]
                        return handleFlight(flight, flightPlans)
                    }
                }
            }

            // If we havent found any matching logic
            // check for a flight override or error.
            if (flight.override !== undefined) {
                return await redirect("override flight", flight.override);
            } else {
                return await redirect("Incorrect Length", "https://github.com/Apollorion/fly/blob/main/help/incorrect-length.md");
            }

        } else {
            return await redirect("Logic Not Found", "https://github.com/Apollorion/fly/blob/main/help/flight-not-found.md");
        }
    } else {
        return await handleStandardFlight(flight, flightPlans);
    }

}