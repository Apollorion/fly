import {Flight, FlightType} from "./types.js";
import {logicalFlights} from "./flights.js";

export function getFlightFromQuery(query: string[]): Flight {
    // Remove null items from values
    query = query.filter(function (el) {
        return el != null;
    });

    if(query[0] in logicalFlights){
        const identifier = query[0];
        query.shift();

        let d = undefined;
        if(logicalFlights[identifier].override !== undefined){
            d = logicalFlights[identifier].override;
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

export async function setCalled(query: string[]){
    console.log("b")
    if(query.length === 3){
        console.log("c")
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
    const dev = false;
    console.log(message, link);
    if(!dev){
        console.log("following link", link);
        // @ts-ignore
        await chrome.tabs.update({url: link});
    }
}

async function setLocalStorage(key: string, value: string){
    console.log("d");
    return new Promise((resolve, reject) => {
        console.log("set", key, value);
        let obj: any = {};
        obj[key] = value;
        // @ts-ignore
        chrome.storage.local.set(obj, function () {
            console.log("f");
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