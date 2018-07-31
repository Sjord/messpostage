(function () {
    "use strict";

    let securityToken = JSON.stringify(crypto.getRandomValues(new Uint16Array(10)));

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

    window.addEventListener("messageListenerDetected", function (evt) {
        if (evt.detail.securityToken === securityToken) {
            chrome.runtime.sendMessage({
                "type": "listener",
                "listener": evt.detail
            });
        }
    });

    /* Add a override.js to the page to override addEventListener */
    function overrideFunctions(securityToken) {
        let addEventListenerOrig = window.addEventListener;
        window.addEventListener = function(type, listener, useCapture, wantsUntrusted) {
            if (type == "message") {
                let evt = new CustomEvent("messageListenerDetected", {detail: {
                    stack: new Error().stack,
                    securityToken: securityToken
                }});
                window.dispatchEvent(evt);
            }
            return addEventListenerOrig.call(this, type, listener, useCapture, wantsUntrusted);
        };
    };

    var s = document.createElement('script');
    s.innerText = '(' + overrideFunctions + ')(' + JSON.stringify(securityToken) + ');'
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
})();
