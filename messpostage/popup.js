(function () {
    "use strict";

    function trimStack(stack) {
        let lines = stack.split("\n");
        lines = lines.slice(1);
        return lines.join("\n");
    }

    function renderListeners(target, listeners) {
        for (let i in listeners) {
            let listener = listeners[i];
            let listenerDiv = document.createElement("div");
            listenerDiv.innerText = trimStack(listener.stack);
            target.appendChild(listenerDiv);
        }
    }

    function renderMessages(target, messages) {
        for (let i in messages) {
            let message = messages[i];
            let messageDiv = document.createElement("div");
            messageDiv.innerText = JSON.stringify(message);
            target.appendChild(messageDiv);
        }
    }

    chrome.runtime.sendMessage({type: "requestMessages"}, function(response) {
        renderMessages(document.getElementById("messages"), response.messages);
        renderListeners(document.getElementById("listeners"), response.listeners);
    });
})();
