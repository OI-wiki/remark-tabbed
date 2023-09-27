// ! This extension is for test only
export const tabbedHtml = {
    enter: {
        tabbedContainer() {
            this.tag("<tabbed>");
        },
        tabbedContainerSummary() {
            this.tag("<summary>");
            this.buffer();
        },
    },
    exit: {
        tabbedContainer() {
            this.tag("</tabbed>");
        },
        tabbedContainerSummary() {
            const data = this.resume();
            this.raw(data);
            this.tag("</summary>");
        },
    },
};
