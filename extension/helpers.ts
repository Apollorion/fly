import {Flight, FlightType, FlightPlans} from "./types.js";
import {logicalFlights, standardFlights} from "./flights.js";
import {setLocalStorage, getLocalStorage, unsetLocalStorage} from "./localstorage.js";

const supportedCustomFlightVersion = "2";

export async function getFlightFromQuery(query: string[], flightPlans: FlightPlans): Promise<Flight> {
    // Remove null items from values
    query = query.filter(function (el) {
        return el != null;
    });

    const logicalFlightPlans = flightPlans.logical;

    if(query[0] in logicalFlightPlans){
        const identifier = query[0];
        query.shift();

        let d = undefined;
        if(logicalFlightPlans[identifier].override !== undefined){
            d = logicalFlightPlans[identifier].override;
        }

        return {
            type: FlightType.LOGICAL,
            identifier,
            values: query,
            override: d
        };
    } else {
        return {
            type: FlightType.STANDARD,
            identifier: query[0]
        }
    }
}

export async function getFlightPlans(): Promise<FlightPlans>{
    let localFlights = undefined;
    try {
        const jsonString = await getLocalStorage("updated-repos");
        localFlights = JSON.parse(jsonString);
    } catch (e) {
        console.log("No custom repo set", e);
    }

    if(localFlights === undefined){
        return {
            logical: logicalFlights,
            standard: standardFlights
        }
    }

    if(localFlights.version !== supportedCustomFlightVersion){
        console.log("Unsupported local flight version");
        return {
            logical: logicalFlights,
            standard: standardFlights
        }
    }

    return {
        logical: { ...logicalFlights, ...localFlights.logical },
        standard: { ...standardFlights, ...localFlights.standard }
    }
}

async function requestJson(url: string): Promise<string> {
    return new Promise(function(resolve,reject){
        fetch(url)
            .then(response => resolve(response.text()))
            .catch(err => reject(err))
    });
}

export async function repoManagement(query: string[]): Promise<string> {
    query.shift();
    const action = query[0];
    query.shift();

    if(!["set", "unset", "update"].includes(action)){
        return `Attempted to run ${action}, but that is not a valid action.`;
    }

    if((action === "set" && query.length !== 2) || (action === "unset" && query.length !== 1)){
        return `${action} called with missing parameter`;
    }

    let repos;
    let repoResult;
    switch(action){
        case "set":
            try {
                repoResult = await getLocalStorage("repos");
            } catch {
                repoResult = "{}";
            }
            repos = JSON.parse(repoResult);

            repos[query[0]] = query[1];
            await setLocalStorage("repos", JSON.stringify(repos));
            return `set ${query[0]} ${query[1]}`;
        case "unset":
            try {
                repoResult = await getLocalStorage("repos");
            } catch {
                repoResult = "{}";
            }
            repos = JSON.parse(repoResult);

            if(Object.keys(repos).includes(query[0])){
                delete repos[query[0]];
            }
            await setLocalStorage("repos", JSON.stringify(repos));
            return `unset ${query[0]}`;
        case "update":
            try {
                repoResult = await getLocalStorage("repos");
                console.log(repoResult);
            } catch {
                repoResult = "{}";
            }
            repos = JSON.parse(repoResult);

            let newRepoContent = {standard: {}, logical: {}, version: supportedCustomFlightVersion};
            for(let name in repos){
                try {
                    let json = JSON.parse(await requestJson(repos[name]));
                    if(Object.keys(json).includes("version") && json.version === supportedCustomFlightVersion
                        && Object.keys(json).includes("logical") && Object.keys(json).includes("standard")){
                        newRepoContent.standard = {...newRepoContent.standard, ...json.standard};
                        newRepoContent.logical = {...newRepoContent.logical, ...json.logical};
                    }
                } catch {
                    console.log(`Failed to fetch repo ${name}`);
                }
            }
            await setLocalStorage("updated-repos", JSON.stringify(newRepoContent));
            return "repos updated";
        default:
            throw new Error("Incorrect repo action");
    }
}

export function makeType(value: string, type: string): string {
    switch(type){
        case "plain":
            return value;
        case "urlencode":
            return encodeURIComponent(value);
        default:
            throw new Error("Type not found");
    }
}

export function getType(value: string): string {
    return value.replace("}", "").split(":")[1]
}

export function getValue(value: string): string {
    return value.replace("${", "").split(":")[0]
}

export async function setCalled(query: string[]){
    if(query.length === 3){
        await setLocalStorage(query[1], query[2]);
    }
}
export async function unsetCalled(query: string[]){
    if(query.length === 2){
        await unsetLocalStorage(query[1]);
    }
}

export async function redirect(message: string, link: string){
    const dev = false;
    console.log(message, link);
    if(!dev){
        console.log("following link", link);
        // @ts-ignore
        await chrome.tabs.update({url: link});
    }
}