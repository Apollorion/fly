import {Flight, FlightType, LogicalFlightDefinition, StandardFlightDefinition, RepoFlightsResponse} from "./types.js";
import {logicalFlights, standardFlights} from "./flights.js";
import {setLocalStorage, getLocalStorage, unsetLocalStorage} from "./localstorage.js";

export async function getFlightFromQuery(query: string[], repoFlightResponse: RepoFlightsResponse | undefined): Promise<Flight> {
    // Remove null items from values
    query = query.filter(function (el) {
        return el != null;
    });

    const newFlights = getNewFlightResponseSynchronous(repoFlightResponse);
    const newLogicalFlights = newFlights.logical;

    if(query[0] in newLogicalFlights){
        const identifier = query[0];
        query.shift();

        let d = undefined;
        if(newLogicalFlights[identifier].override !== undefined){
            d = newLogicalFlights[identifier].override;
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

export function getNewFlightResponseSynchronous(repoFlightResponse: RepoFlightsResponse | undefined) : RepoFlightsResponse{
    let newLogicalFlights: LogicalFlightDefinition;
    if(repoFlightResponse !== undefined) {
        newLogicalFlights = {
            ...logicalFlights,
            ...repoFlightResponse.logical
        }
    } else {
        newLogicalFlights = {
            ...logicalFlights
        }
    }

    let newStandardFlights: StandardFlightDefinition;
    if(repoFlightResponse !== undefined) {
        newStandardFlights = {
            ...standardFlights,
            ...repoFlightResponse.standard
        }
    } else {
        newStandardFlights = {
            ...standardFlights
        }
    }

    return {
        logical: newLogicalFlights,
        standard: newStandardFlights
    }

}

export async function checkRepoFlights(): Promise<RepoFlightsResponse | undefined>{
    try {
        const jsonString = await getLocalStorage("updated-repos");
        return JSON.parse(jsonString);
    } catch (e) {
        console.log("No custom repo set", e);
        return undefined;
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
            } catch {
                repoResult = "{}";
            }
            repos = JSON.parse(repoResult);

            let newRepoContent = {standard: {}, logical: {}};
            for(let name in repos){
                try {
                    let json = JSON.parse(await requestJson(repos[name]));
                    if(json.version === "1" && Object.keys(json).includes("logical") && Object.keys(json).includes("standard")){
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