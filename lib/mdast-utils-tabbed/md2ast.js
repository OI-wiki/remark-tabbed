function enter(type, token, name) {
    this.enter({ type: type, name: name !== null && name !== void 0 ? name : "", attributes: {}, children: [] }, token);
}
export const fromMarkdownTabbed = {
    enter: {
        tabbedContainer: function (token) {
            enter.call(this, "tabbedContainer", token, "tabbed");
        },
        tabbedContainerTitle: function (token) {
            enter.call(this, "tabbedContainerTitle", token, "title");
        },
    },
    exit: {
        tabbedContainer: function (token) {
            this.exit(token);
        },
        tabbedContainerTitle: function (token) {
            this.exit(token);
        },
    },
};
