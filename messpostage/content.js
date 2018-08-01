(function () {
    "use strict";

    function randomString() {
        return JSON.stringify(crypto.getRandomValues(new Uint16Array(16)));
    }

    /* Event name for when addEventListener("message") was called.
       This is random for security, so that webpages can't spoof such an event. */
    const eventName = "messpostage-messageListenerDetected-" + randomString();

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

    window.addEventListener(eventName, function (evt) {
        chrome.runtime.sendMessage({
            "type": "listener",
            "listener": evt.detail
        });
    });

    /* Add a override function to the page to override addEventListener */
    function overrideFunctions(eventName) {
        let addEventListenerOrig = window.addEventListener;
        window.addEventListener = function(type, listener, useCapture, wantsUntrusted) {
            if (type === "message") {
                let evt = new CustomEvent(eventName, {detail: {
                    stack: new Error().stack
                }});
                window.dispatchEvent(evt);
            }
            return addEventListenerOrig.call(this, type, listener, useCapture, wantsUntrusted);
        };
    };

    var s = document.createElement('script');
    s.innerText = '(' + overrideFunctions + ')(' + JSON.stringify(eventName) + ');'
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
})();
