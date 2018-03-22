(function () {
    function trim_stack(stack) {
        var lines = stack.split('\n');
        lines = lines.slice(1);
        return lines.join('\n');
    }

    function render_listeners(target, listeners) {
        for (let i in listeners) {
            let listener = listeners[i];
            let listenerDiv = document.createElement("div");
            listenerDiv.innerText = trim_stack(listener.stack);
            target.appendChild(listenerDiv);
        }
    }

    function render_messages(target, messages) {
        for (let i in messages) {
            let message = messages[i];
            let messageDiv = document.createElement("div");
            messageDiv.innerText = JSON.stringify(message);
            target.appendChild(messageDiv);
        }
    }

    chrome.runtime.sendMessage({type: "requestMessages"}, function(response) {
        render_messages(document.getElementById("messages"), response.messages);
        render_listeners(document.getElementById("listeners"), response.listeners);
    });
})();
