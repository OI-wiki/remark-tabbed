import { Extension } from "mdast-util-from-markdown/lib";

// ! This extension is for test only
export const tabbedHtml: Extension = {
  enter: {
    tabbedContainer() {
      (this as any).tag("<tabbed>");
    },
    tabbedContainerTitle() {
      (this as any).tag("<title>");
      this.buffer();
    },
  },
  exit: {
    tabbedContainer() {
      (this as any).tag("</tabbed>");
    },
    tabbedContainerTitle() {
      const data = this.resume();
      (this as any).raw(data);
      (this as any).tag("</title>");
    },
  },
};
