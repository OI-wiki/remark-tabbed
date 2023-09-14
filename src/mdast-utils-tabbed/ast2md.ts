
import { Options, Handlers, Context} from 'mdast-util-to-markdown'
import { containerPhrasing } from 'mdast-util-to-markdown/lib/util/container-phrasing.js'
import { containerFlow } from 'mdast-util-to-markdown/lib/util/container-flow.js'
import { indentLines } from 'mdast-util-to-markdown/lib/util/indent-lines.js'
import { Node } from 'mdast-util-to-markdown/lib'

declare module 'mdast-util-to-markdown' {
    interface ConstructNameMap {
      // Register a new construct name (value is used, key should match it).
      tabbedContainer: 'tabbedContainer',
      tabbedContainerSummary: 'tabbedContainerSummary',
    }
}

function tabbed_summary_handle(node: any, parent: Node, state: Context) {
    let value = containerPhrasing(node, state, {before: ' ', after: '\n'})
    value += '\n'
    return value
}

function map(line: string, _: any, blank: any) {
    return '    ' + line
}

function tabbed_handle(node: any, parent: Node, state: Context) {
    const exit = state.enter('tabbed' as any)
    let header = '=== ';
    let original_children = [...node.children]
    node.children = original_children.slice(0, 1) // summary
    header += `"${containerFlow(node, state)}"`
    node.children = original_children.slice(1, original_children.length) // content
    let value = containerFlow(node, state)
    value = indentLines(value, map)
    exit()
    return header + value;
}

const handlers: Handlers = {
    'tabbedContainer': tabbed_handle,
    'tabbedContainerSummary': tabbed_summary_handle,
} as any;

export const detailsToMarkdown: Options = {
    handlers: handlers
};