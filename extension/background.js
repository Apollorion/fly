//
// This (suggest) is currently bugged due to an issue with chromes API:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1186804
// Once resolved we can do this again.
//
// chrome.omnibox.onInputChanged.addListener((text, suggest) => {
//     chrome.storage.local.get(["history"], function(items){
//         if(items?.history) {
//             const suggestions = JSON.parse(items.history).map((history) => {
//                 if (history.toLowerCase().includes(text.toLowerCase())) {
//                     return {
//                         content: history,
//                         description: history
//                     };
//                 }
//             });
//
//             const filtered = suggestions.filter(function (x) {
//                 return x !== undefined;
//             });
//
//             suggest(filtered);
//         }
//     });
// });

chrome.omnibox.onInputEntered.addListener((text, OnInputEnteredDisposition) => {

    chrome.storage.local.get(["history"], function(items){
        let history;
        if(items?.history) {
            history = JSON.parse(items.history);
            history.push(text);
        } else {
            history = [text];
        }

        chrome.storage.local.set({history: JSON.stringify(history)}, function () {
            chrome.tabs.update({url: "https://fly.apollorion.com/" + text});
        });
    });

});