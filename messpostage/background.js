(function () {
    "use strict";

    /*
        tabId → {
            "items": [...],
            "persist": false
        }
    */
    const tabData = new Map();

    function resetDataForTab(tabId) {
        tabData.set(tabId, {
            "items": [],
            "persist": false
        });
    }

    function getDataForTab(tabId) {
        if (!tabData.has(tabId)) {
            resetDataForTab(tabId);
        }

        return tabData.get(tabId);
    }

    function updateToolbarIcon(unread) {
        if (unread) {
            chrome.browserAction.setIcon({
                path: "active_message_48.png"
            });
            chrome.browserAction.setTitle({
                title: "You have unread messages"
            });
            chrome.browserAction.setBadgeText({
                text: unread.toString()
            });
        } else {
            chrome.browserAction.setIcon({
                path: "no_message_48.png"
            });
            chrome.browserAction.setTitle({
                title: "MessPostage"
            });
            chrome.browserAction.setBadgeText({
                text: ""
            });
        }
    }

    function runForCurrentTab(callback) {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            callback(tabs[0]);
        });
    }

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.type === "requestMessages") {
            // The popup asks for postMessage activity.
            runForCurrentTab(currentTab => {
                let currentTabData = getDataForTab(currentTab.id);
                sendResponse(currentTabData);
            });
            return true;
        } else if (request.type === "clearMessages") {            
            runForCurrentTab(currentTab => {
                resetDataForTab(currentTab.id);
                updateToolbarIcon(0);
                sendResponse(getDataForTab(currentTab.id));   
            });
            return true;                     
        } else if (request.type === "foundItem") {
            // The content script informed us that it has found postMessage activity.
            let senderTabData = getDataForTab(sender.tab.id);

            senderTabData.items.push(request.item);
            updateToolbarIcon(senderTabData.items.length);
        } else if (request.type === "setPersist") {
            // Should we clear everything when navigating to another page?
            runForCurrentTab(currentTab => {
                let currentTabData = getDataForTab(currentTab.id);
                currentTabData.persist = request.value;
                sendResponse(currentTabData);
            });
            return true;
        } else {
            throw `Unsupported message ${request.type}`;
        }
    });

    chrome.tabs.onActivated.addListener(function (activeTab) {
        // The user switched to this tab. Show the corresponding data on the toolbar icon.
        let currentTabData = getDataForTab(activeTab.tabId);
        updateToolbarIcon(currentTabData.items.length);
    });

    chrome.tabs.onRemoved.addListener(function (tabId) {
        // Tab has been closed. Clean up this tab's data.
        tabData.delete(tabId);
    });

    chrome.webNavigation.onCommitted.addListener(function (details) {
        // We browsed to another page. Reset this tab's data.
        const isTopLevel = details.frameId === 0;
        if (isTopLevel) {
            const tabId = details.tabId;
            const tabData = getDataForTab(tabId);
            if (!tabData.persist) {
                resetDataForTab(tabId);
                updateToolbarIcon(0);
            }
        }
    });
})();
