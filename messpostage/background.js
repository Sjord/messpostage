(function () {
    var messages = [];
    var listeners = [];
    var unread = 0;

    function notifyMessages() {
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
        if (request.type == "message") {
            messages.push(request.message);
            unread += 1;
            notifyMessages();
        }
        if (request.type == "listener") {
            listeners.push(request.listener);
            unread += 1;
            notifyMessages();
        }
        if (request.type == "requestMessages") {
            unread = 0;
            notifyMessages();

            sendResponse({
                "messages": messages,
                "listeners": listeners
            });
        }
    });
})();
