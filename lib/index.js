import { h } from "hastscript";
import { visit } from "unist-util-visit";
import { tabbedToMarkdown } from "./mdast-utils-tabbed/ast2md";
import { fromMarkdownTabbed } from "./mdast-utils-tabbed/md2ast";
import { syntax } from "./micromark-tabbed/syntax";
let warningIssued = false;
const remarkTabbed = function (options) {
    var _a, _b, _c, _d;
    const data = this.data();
    // warning for old remarks
    if (!warningIssued &&
        (((_b = (_a = this.Parser) === null || _a === void 0 ? void 0 : _a.prototype) === null || _b === void 0 ? void 0 : _b.blockTokenizers) ||
            ((_d = (_c = this.Compiler) === null || _c === void 0 ? void 0 : _c.prototype) === null || _d === void 0 ? void 0 : _d.visitors))) {
        warningIssued = true;
        console.warn("[remark-tabbed] Warning: please upgrade to remark 13 to use this plugin");
    }
    function add(field, value) {
        /* istanbul ignore if - other extensions. */
        if (data[field])
            data[field].push(value);
        else
            data[field] = [value];
    }
    add("micromarkExtensions", syntax);
    add('fromMarkdownExtensions', fromMarkdownTabbed);
    add("toMarkdownExtensions", tabbedToMarkdown);
    return transform;
    function transform(tree) {
        visit(tree, ["tabbedContainer", "tabbedContainerTitle"], ontabbed);
    }
    function ontabbed(node) {
        var data = node.data || (node.data = {});
        var hast = h(node.name);
        data.hName = hast.tagName;
        data.hProperties = hast.properties;
    }
};
export default remarkTabbed;
