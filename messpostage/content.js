(function () {
    /* Pass messages sent to this frame to the background script */
    window.addEventListener("message", function (message) {
        console.log("Message received", message);
    });
})();
