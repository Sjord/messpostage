(function () {
    "use strict";

    /*
        tabId → {
            "messages": [...]
            "listeners": [...]
            "unread": 0
        }
    */
    const tabData = new Map();

    function resetDataForTab(tabId) {
        tabData.set(tabId, {
            "messages": [],
            "listeners": [],
            "unread": 0
        });
    }

    function resetMessagesForTab(tabId) {
        let currentData = getDataForTab(tabId);
        currentData.messages = [];
        currentData.unread = 0;
        tabData.set(tabId, currentData);
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

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.type === "requestMessages") {
            // The popup asks for postMessage activity.
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
                let currentTab = tabs[0];
                let currentTabData = getDataForTab(currentTab.id);
                sendResponse(currentTabData);
            });
            return true;
        } else if (request.type === "clearMessages") {            
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
                let currentTab = tabs[0];                
                resetMessagesForTab(currentTab.id);
                updateToolbarIcon(0);
                sendResponse(getDataForTab(currentTab.id));   
            });
            return true;                     
        }
        else {
            // The content script informed us that it has found postMessage activity.
            let senderTabData = getDataForTab(sender.tab.id);

            if (request.type === "message") {
                senderTabData.messages.push(request.message);
                senderTabData.unread += 1;
                updateToolbarIcon(senderTabData.unread);
            } else if (request.type === "listener") {
                senderTabData.listeners.push(request.listener);
                senderTabData.unread += 1;
                updateToolbarIcon(senderTabData.unread);
            }
        }
    });

    chrome.tabs.onActivated.addListener(function (activeTab) {
        // The user switched to this tab. Show the corresponding data on the toolbar icon.
        let currentTabData = getDataForTab(activeTab.tabId);
        updateToolbarIcon(currentTabData.unread);
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
            resetDataForTab(tabId);
            updateToolbarIcon(0);
        }
    });
})();
