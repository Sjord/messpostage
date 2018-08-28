(function () {
    "use strict";

    class Item {
        constructor(data) {
            Object.assign(this, data);
        }

        image() {
            return this.item.type + ".svg";
        }
    }

    class Message extends Item {
        details() {
            return JSON.stringify(this.data, null, 2);
        }
    }

    class Listener extends Item {
        // Remove the first line of a stack trace
        trimStack(stack) {
            let lines = stack.split("\n");
            lines = lines.slice(1);
            return lines.join("\n");
        }

        details() {
            return this.trimStack(this.stack);
        }
    }

    class ItemRow {
        constructor(item) {
            this.item = item;
        }

        view() {
            return m("tr", {
                "class": "itemrow",
                onclick: e => e.currentTarget.classList.toggle("expanded")
            }, [
                m("td", m("img", {
                    title: this.item.type,
                    src: this.item.type + ".svg"
                })),
                m("td", {"class": "details"}, m("div", this.item.details())),
            ]);
        }
    }

    // Component that contains the correct type of row for each item.
    class ResultList {
        constructor(data) {
            this.data = data;
        }

        view() {
            return m("table", this.data.map(msg => m(new ItemRow(msg))));
        }
    }

    // Ask to clear the message list and rerender.
    function clearMessages() {
        chrome.runtime.sendMessage({type: "clearMessages"}, function(response) {
            displayResponse(response);
        });
    }

    // Returns a list of Message and Listener objects.
    function convertItemsToObjects(itemData) {
        const classes = {"message": Message, "listener": Listener};
        return itemData.map(data => new classes[data.type](data));
    }

    // Render the data response we got from the background page.
    function displayResponse(response) {
        const items = convertItemsToObjects(response.items);
        m.render(document.body, [
            m("button", {onclick: clearMessages}, "clear"),
            m(new ResultList(items)),
        ]);
    }

    // Request a new dataset from the background page.
    chrome.runtime.sendMessage({type: "requestMessages"}, function(response) {
        displayResponse(response);
    });
})();
