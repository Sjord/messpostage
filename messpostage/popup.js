(function () {
    "use strict";

    // Remove the first line of a stack trace
    function trimStack(stack) {
        let lines = stack.split("\n");
        lines = lines.slice(1);
        return lines.join("\n");
    }

    class ItemRow {
        constructor(item) {
            this.item = item;
        }

        view() {
            return m("div", {"class": "itemrow"}, [
                m("img", {
                    title: this.item.type,
                    src: this.item.type + ".svg"
                }),
                m("span", {
                    "class": "message-data"
                }, JSON.stringify(this.item))
            ]);
        }
    }

    // Component that contains the correct type of row for each item.
    class ResultList {
        constructor(data) {
            this.data = data;
        }

        view() {
            return this.data.map(msg => m(new ItemRow(msg)));
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
