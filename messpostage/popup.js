(function () {
    "use strict";

    function trimStack(stack) {
        let lines = stack.split("\n");
        lines = lines.slice(1);
        return lines.join("\n");
    }

    function renderListeners(target, listeners) {
        target.innerHTML  = '';
        for (let i in listeners) {
            let listener = listeners[i];
            let listenerDiv = document.createElement("div");
            listenerDiv.innerText = trimStack(listener.stack);
            target.appendChild(listenerDiv);
        }
    }

    function renderMessages(target, messages) {
        target.innerHTML  = '';
        for (let i in messages) {
            let message = messages[i];
            let messageDiv = document.createElement("div");
            messageDiv.innerText = JSON.stringify(message);
            target.appendChild(messageDiv);
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        var link = document.getElementById('clearButton');
        // onClick's logic below:
        link.addEventListener('click', function() {
            chrome.runtime.sendMessage({type: "clearMessages"}, function(response) {
                renderMessages(document.getElementById("messages"), response.messages);
                renderListeners(document.getElementById("listeners"), response.listeners);
            });
        });
    });

    chrome.runtime.sendMessage({type: "requestMessages"}, function(response) {
        renderMessages(document.getElementById("messages"), response.messages);
        renderListeners(document.getElementById("listeners"), response.listeners);
    });
})();
