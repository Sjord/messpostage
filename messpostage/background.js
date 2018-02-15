(function () {
    var messages = [];
    var listeners = [];
    var unread = 0;

    function notifyMessages() {
        chrome.browserAction.setIcon({
            path: "active_message_48.png"
        });
        chrome.browserAction.setTitle({
            title: "You have unread messages"
        });
        chrome.browserAction.setBadgeText({
            text: unread.toString()
        });
    }

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log("recevied message ", request);
        if (request.type == "message") {
            messages.push(request.message);
            unread += 1;
            notifyMessages();
        }
        if (request.type == "listener") {
            listeners.push(request.listener);
        }
        if (request.type == "requestMessages") {
            sendResponse({
                "messages": messages,
                "listeners": listeners
            });
        }
    });
})();
