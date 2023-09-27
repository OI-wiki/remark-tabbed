import { Element, Node, Root } from 'hast';
import { unified, Plugin, Transformer } from 'unified';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';
import testCase, { fromPath } from './test-case.js';
import remarkTabbed from '../lib/index.js';

const htmlTabbed: Plugin<[], Root, Root> = function (): Transformer<Root> {
	return (tree: Root) => {
		visit(tree, ['tabbedContainer', 'tabbedContainerTitle'], (node: Node | any) => {
			var data = node.data || (node.data = {});
			var hast = h(node.name, node.attributes) as unknown as Element;
			data.hName = hast.tagName;
			data.hProperties = hast.properties;
		});
	}
}

testCase.processor = input => {
	return unified()
		.use(remarkParse)
		// the main plugin written, based on micromark
		.use(remarkTabbed)
		// the function above, transform tabbed related tags to html-compilable
		.use(htmlTabbed)
		.use(remark2rehype)
		.use(rehypeStringify)
		.processSync(input).value as string;
}

testCase({
	input: 'hello world',
	expected: '<p>hello world</p>',
	message: 'basic test',
});
testCase({
	input: '=== Python\n',
	expected: '<tabbed><title>Python</title></tabbed>',
	message: 'no content tabbed',
});

testCase({
  input: 
`=== Python
    how to do this`,
  expected: "<tabbed><title>Python</title><p>how to do this</p></tabbed>",
  message: "tabbed single line",
});

testCase({
	input: 
`=== Python
    how to do this
    how to do that`,
	expected: `<tabbed><title>Python</title><p>how to do this
how to do that</p></tabbed>`,
	message: 'tabbed 2 lines',
});

testCase({
	input: 
`=== Python
    to be or not to be
    that is the question

but now it is not`,
	expected: `<tabbed><title>Python</title><p>to be or not to be
that is the question</p></tabbed>
<p>but now it is not</p>`,
	message: 'tabbed ends with empty line',
});

testCase({
	input: 
`=== C++
    The sunlight claps the earth,
    and the moonbeams kiss the sea:
    what are all these kissings worth,
    \`\`\`cpp
    for (int i = 0; i <= 100; i++) {
        cout << "if thou kiss not me?" << endl;
    }
    \`\`\`

if not me, who`,
	expected: `<tabbed><title>C++</title><p>The sunlight claps the earth,
and the moonbeams kiss the sea:
what are all these kissings worth,</p><pre><code class="language-cpp">for (int i = 0; i &#x3C;= 100; i++) {
    cout &#x3C;&#x3C; "if thou kiss not me?" &#x3C;&#x3C; endl;
}
</code></pre></tabbed>
<p>if not me, who</p>`,
	message: 'tabbed with code ends',
});

testCase({
	input: 
`=== Python
    > I have drunken deep of joy,
    And I will taste no other wine tonight

thats it`,
	expected: `<tabbed><title>Python</title><blockquote>
<p>I have drunken deep of joy,
And I will taste no other wine tonight</p>
</blockquote></tabbed>
<p>thats it</p>`,
	message: 'tabbed with note and blockquote',
});

testCase({
  input: `=== Python
    \`\`\`python
    a = 1
    \`\`\`

=== C++
    \`\`\`cpp
    int a = 1;
    \`\`\`

Here are 2 versions of code.`,
  expected: `<tabbed><title>Python</title><pre><code class="language-python">a = 1
</code></pre></tabbed>
<tabbed><title>C++</title><pre><code class="language-cpp">int a = 1;
</code></pre></tabbed>
<p>Here are 2 versions of code.</p>`,
  message: "2 code tabs",
});

// for (let i = 8; i <= 15; ++i) {
// 	testCase({
// 		input: fromPath(`test/input/${i}.md`),
// 		expected: fromPath(`test/expected/${i}.md`),
// 		message: 'tabbed with many codes'
// 	});
// }
