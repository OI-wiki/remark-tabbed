import testCase from "./test-case.js";
import { micromark } from 'micromark';
import { syntax, tabbedHtml as html, } from '../lib/micromark-tabbed/index.js';

testCase.processor = (input: string) => {
	return micromark(input, {
		extensions: [syntax],
		htmlExtensions: [html as any]
	});
}
testCase({
	input: 'hello world',
	expected: '<p>hello world</p>',
	message: 'basic test',
});

testCase({
	input: '=== C++\n',
	expected: '<tabbed><title>C++</title>\n</tabbed>',
	message: 'no content tabbed',
});
