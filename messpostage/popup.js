(function () {
    chrome.runtime.sendMessage({type: "requestMessages"}, function(response) {
        let container = document.getElementById("messages");
        container.innerText = JSON.stringify(response.messages);

        let container2 = document.getElementById("listeners");
        container2.innerText = JSON.stringify(response.listeners);
    });
})();
