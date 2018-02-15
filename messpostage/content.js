(function () {
    /* Pass messages sent to this frame to the background script */
    window.addEventListener("message", function (message) {
        chrome.runtime.sendMessage({
            "type": "message",
            "message": {
                data: message.data,
                origin: message.origin
            }
        });
    });
})();
