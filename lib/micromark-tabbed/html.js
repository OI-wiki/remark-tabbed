// ! This extension is for test only
export const tabbedHtml = {
    enter: {
        tabbedContainer() {
            this.tag("<tabbed>");
        },
        tabbedContainerTitle() {
            this.tag("<title>");
            this.buffer();
        },
    },
    exit: {
        tabbedContainer() {
            this.tag("</tabbed>");
        },
        tabbedContainerTitle() {
            const data = this.resume();
            this.raw(data);
            this.tag("</title>");
        },
    },
};
