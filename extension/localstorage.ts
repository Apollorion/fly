export async function getLocalStorage(key: string): Promise<string>{
    return new Promise((resolve, reject) => {
        console.log("get", key);
        chrome.storage.local.get([key], async function (items: { [x: string]: string; }) {
            if(chrome.runtime.lastError) {
                console.warn("Whoops.. " + chrome.runtime.lastError.message);
            }
            if(key in items){
                resolve(items[key]);
            } else {
                reject();
            }
        });
    });
}

export async function setLocalStorage(key: string, value: string){
    return new Promise((resolve, reject) => {
        console.log("set", key, value);
        let obj: any = {};
        obj[key] = value;
        chrome.storage.local.set(obj, function () {
            if(chrome.runtime.lastError) {
                console.warn("Whoops.. " + chrome.runtime.lastError.message);
            }
            resolve(undefined);
        });
    });
}

export async function unsetLocalStorage(key: string){
    return new Promise((resolve, reject) => {
        console.log("unset", key);
        chrome.storage.local.remove(key, function () {
            if(chrome.runtime.lastError) {
                console.warn("Whoops.. " + chrome.runtime.lastError.message);
            }
            resolve(undefined);
        });
    });
}