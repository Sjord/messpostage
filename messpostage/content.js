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

    /* Add a override.js to the page to override addEventListener */
    function overrideFunctions() {
        let addEventListenerOrig = window.addEventListener;
        window.addEventListener = function(type, listener, useCapture, wantsUntrusted) {
            if (type == "message") {
                console.log("hiero");
                chrome.runtime.sendMessage("nekmcedlnlncblgjfkopjlbeeijcnmgd", {
                    type: "listener",
                    listener: {
                        hello: "world"
                        /*location: new Error("message handler added").stack*/
                    }
                }, {});
            }
            return addEventListenerOrig.call(this, type, listener, useCapture, wantsUntrusted);
        };
    };

    var s = document.createElement('script');
    s.innerText = '(' + overrideFunctions + ')();'
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
})();
