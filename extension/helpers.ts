import {Flight, FlightType, LogicalFlightDefinition, StandardFlightDefinition, RepoFlightsResponse} from "./types.js";
import {logicalFlights, standardFlights} from "./flights.js";

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
    let response;
    try {
        const repoUrl = await getLocalStorage("repo");
        const jsonString = await requestJson(repoUrl);
        response = JSON.parse(jsonString);
    } catch (e) {
        console.log("No custom repo set", e);
        return undefined;
    }

    if(response.version === "1" && Object.keys(response).includes("logical") && Object.keys(response).includes("standard")){
        return {
            standard: response.standard,
            logical: response.logical
        }
    }

    return undefined;

}

async function requestJson(url: string): Promise<string> {
    return new Promise(function(resolve,reject){
        fetch(url)
            .then(response => resolve(response.text()))
            .catch(err => reject(err))
    });
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

export async function getLocalStorage(key: string): Promise<string>{
    return new Promise((resolve, reject) => {
        console.log("get", key);
        // @ts-ignore
        chrome.storage.local.get([key], async function (items: { [x: string]: string; }) {
            if(key in items){
                resolve(items[key]);
            } else {
                reject();
            }
        });
    });
}

export async function redirect(message: string, link: string){
    const dev = true;
    console.log(message, link);
    if(!dev){
        console.log("following link", link);
        // @ts-ignore
        await chrome.tabs.update({url: link});
    }
}

async function setLocalStorage(key: string, value: string){
    return new Promise((resolve, reject) => {
        console.log("set", key, value);
        let obj: any = {};
        obj[key] = value;
        // @ts-ignore
        chrome.storage.local.set(obj, function () {
            resolve(undefined);
        });
    });
}

async function unsetLocalStorage(key: string){
    return new Promise((resolve, reject) => {
        console.log("unset", key);
        // @ts-ignore
        chrome.storage.local.remove(key, function () {
            resolve(undefined);
        });
    });
}