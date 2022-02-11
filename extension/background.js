chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    chrome.bookmarks.search(text, (bookmarks) => {
        const suggestions = bookmarks.map((bookmark) => {
            if (
                bookmark.url !== undefined &&
                bookmark.title !== undefined &&
                bookmark.url !== "" &&
                bookmark.title !== ""
            ) {
                return {
                    content: bookmark.url,
                    description: bookmark.title,
                };
            }
        });

        const filtered = suggestions.filter(function(x) {
            return x !== undefined;
        })
        suggest(filtered);
    });

});

chrome.omnibox.onInputEntered.addListener((text, OnInputEnteredDisposition) => {
    if(text.startsWith("http") || text.startsWith("https")) {
        chrome.tabs.update({url: text});
    } else {
        chrome.tabs.update({url: "https://fly.apollorion.com/" + text});
    }
});