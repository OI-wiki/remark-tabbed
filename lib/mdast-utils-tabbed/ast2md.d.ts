import { Options } from "mdast-util-to-markdown";
declare module "mdast-util-to-markdown" {
    interface ConstructNameMap {
        tabbedContainer: "tabbedContainer";
        tabbedContainerTitle: "tabbedContainerTitle";
        tabbedContainerContent: "tabbedContainerContent";
    }
}
export declare const tabbedToMarkdown: Options;
