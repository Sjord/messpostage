(function () {
    chrome.runtime.sendMessage({type: "requestMessages"}, function(response) {
        let container = document.getElementById("messages");
        container.innerText = JSON.stringify(response.messages);
    });
})();
