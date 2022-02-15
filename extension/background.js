const dev = false;

const supportedLogicalFlights = ["gh", "aws"];

async function main() {
    chrome.omnibox.onInputEntered.addListener((text, OnInputEnteredDisposition) => {

        const query = text.split(" ");
        if(query[0] === "set"){
            setCalled(query);
        } else {
            if(supportedLogicalFlights.includes(query[0])){
                const flightType = query[0];
                switch(flightType){
                    case "gh":
                        goToGithub(query);
                        break;
                    default:
                        goToLogicalFlight(query);
                        break;
                }
            } else {
                goToUrl(query);
            }
        }

    });
}

async function goToGithub(query){
    if(query.length === 3) {
        return await goToLogicalFlight(query);
    }

    try {
        let org = await getLocalStorage("gh-org");
        return await goToUrl(["flight", "gh", `${org}-${query[1]}`]);
    } catch {
        return await goToUrl(["config-github", "org-not-set"]);
    }
}

async function goToLogicalFlight(query){
    let selector = query[0];
    query.shift();
    await goToUrl(["flight", selector, query.join("-")])
}

async function setCalled(query){
    if(query.length === 3){
        await setLocalStorage(query[1], query[2]);
    }
}

async function goToUrl(query){
    let history;
    try {
        history = await getLocalStorage("history")
        history.push(query.join("/"));
    } catch {
        history = [query.join("/")];
    }

    await setLocalStorage("history", history);

    if(dev){
        console.log("You would fly to:", "https://fly.apollorion.com/" + query.join("/"));
    } else {
        await chrome.tabs.update({url: "https://fly.apollorion.com/" + query.join("/")});
    }

}

async function setLocalStorage(key, value){
    return new Promise((resolve, reject) => {
        let obj = {};
        obj[key] = JSON.stringify(value);
        chrome.storage.local.set(obj, function () {
            resolve();
        });
    });
}

async function getLocalStorage(key){
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], async function (items) {
            if(key in items){
                resolve(JSON.parse(items[key]));
            } else {
                reject();
            }
        });
    });
}

main().then(()=>{
    console.log("Finished");
});