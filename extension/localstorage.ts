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

export async function setLocalStorage(key: string, value: string){
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

export async function unsetLocalStorage(key: string){
    return new Promise((resolve, reject) => {
        console.log("unset", key);
        // @ts-ignore
        chrome.storage.local.remove(key, function () {
            resolve(undefined);
        });
    });
}