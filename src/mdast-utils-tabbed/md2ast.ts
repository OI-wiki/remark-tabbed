import { CompileContext, Extension, Token } from "mdast-util-from-markdown/lib";

function enter(this: CompileContext, type: string, token: Token, name: string) {
  this.enter(
    { type: type as any, name: name ?? "", attributes: {}, children: [] },
    token
  );
}

export const fromMarkdownTabbed: Extension = {
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
