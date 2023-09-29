import { containerPhrasing } from "mdast-util-to-markdown/lib/util/container-phrasing.js";
import { containerFlow } from "mdast-util-to-markdown/lib/util/container-flow.js";
import { indentLines } from "mdast-util-to-markdown/lib/util/indent-lines.js";
function tabbed_title_handle(node, parent, state) {
    let value = containerPhrasing(node, state, { before: " ", after: "\n" });
    value += "\n";
    return value;
}
function map(line, _, blank) {
    return "    " + line;
}
function tabbed_handle(node, parent, state) {
    const exit = state.enter("tabbed");
    //   console.log(node);
    let header = "=== ";
    let original_children = [...node.children];
    node.children = original_children.slice(0, 1); // title
    header += containerFlow(node, state);
    node.children = original_children.slice(1, original_children.length); // content
    //   for (let child of node.children) {
    //     if (typeof(child.value) != "string") {
    //         child.value = child.value.toString()
    //     }
    //   }
    //   console.log(node);
    let value = containerFlow(node, state);
    value = indentLines(value, map);
    exit();
    return header + value;
}
const handlers = {
    tabbedContainer: tabbed_handle,
    tabbedContainerTitle: tabbed_title_handle,
};
export const tabbedToMarkdown = {
    handlers: handlers,
};
