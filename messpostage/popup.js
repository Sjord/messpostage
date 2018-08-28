(function () {
    "use strict";

    // Remove the first line of a stack trace
    function trimStack(stack) {
        let lines = stack.split("\n");
        lines = lines.slice(1);
        return lines.join("\n");
    }

    // Component that calls stringifier on each data element.
    class ResultList {
        constructor(data, stringifier) {
            this.data = data;
            this.stringifier = stringifier;
        }

        view() {
            return this.data.map(msg => m("div", this.stringifier(msg)));
        }
    }

    // Ask to clear the message list and rerender.
    function clearMessages() {
        chrome.runtime.sendMessage({type: "clearMessages"}, function(response) {
            displayResponse(response);
        });
    }

    // Render the data response we got from the background page.
    function displayResponse(response) {
        m.render(document.body, [
            m("button", {onclick: clearMessages}, "clear"),
            m(new ResultList(response.items, JSON.stringify)),
        ]);
    }

    // Request a new dataset from the background page.
    chrome.runtime.sendMessage({type: "requestMessages"}, function(response) {
        displayResponse(response);
    });
})();
