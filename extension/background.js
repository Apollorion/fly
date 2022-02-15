const dev = false;

async function main() {
    chrome.omnibox.onInputEntered.addListener((text, OnInputEnteredDisposition) => {

        const query = text.split(" ");
        if(query[0] === "set"){
            setCalled(query);
        } else {
            switch(query[0]){
                case "gh":
                    goToGithub(query);
                    break;
                default:
                    goToUrl(query);
                    break;
            }
        }

    });
}

async function goToGithub(query){
    if(query.length !== 2){
        return goToUrl(["config-github", "repo-not-set"]);
    }

    try {
        let org = await getLocalStorage("gh-org");
        goToUrl(["logical", "gh", `${org}-${query[1]}`]);
    } catch {
        goToUrl(["config-github", "org-not-set"]);
    }
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
        chrome.tabs.update({url: "https://fly.apollorion.com/" + query.join("/")});
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