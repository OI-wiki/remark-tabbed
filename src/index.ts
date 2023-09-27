import { Node, Root } from "hast";
import { h } from "hastscript";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

import { tabbedToMarkdown } from "./mdast-utils-tabbed/ast2md";
import { fromMarkdownTabbed } from "./mdast-utils-tabbed/md2ast";
import { syntax } from "./micromark-tabbed/syntax";

interface TabbedNode extends Node {
  name: string;
}

let warningIssued = false;
const remarkTabbed: Plugin = function (options) {
  const data = this.data() as Record<string, unknown[] | undefined>;
  // warning for old remarks
  if (
    !warningIssued &&
    (this.Parser?.prototype?.blockTokenizers ||
      this.Compiler?.prototype?.visitors)
  ) {
    warningIssued = true;
    console.warn(
      "[remark-tabbed] Warning: please upgrade to remark 13 to use this plugin"
    );
  }

  function add(field: string, value: unknown) {
    /* istanbul ignore if - other extensions. */
    if (data[field]) data[field]!.push(value);
    else data[field] = [value];
  }

  add("micromarkExtensions", syntax);
  add('fromMarkdownExtensions', fromMarkdownTabbed);
  add("toMarkdownExtensions", tabbedToMarkdown);

  return transform;

  function transform(tree) {
    visit(tree, ["tabbedContainer", "tabbedContainerTitle"], ontabbed);
  }

  function ontabbed(node: TabbedNode) {
    var data = node.data || (node.data = {});
    var hast = h(node.name);
    data.hName = hast.tagName;
    data.hProperties = hast.properties;
  }
};
export default remarkTabbed;
