import { factorySpace } from 'micromark-factory-space';
import { markdownSpace } from 'micromark-util-character';
import { markdownLineEnding } from 'micromark-util-character';
import { codes } from 'micromark-util-symbol/codes.js';
import { constants } from 'micromark-util-symbol/constants.js';
import { types } from 'micromark-util-symbol/types.js';
import { Extension, State, Token, Tokenizer } from 'micromark-util-types';

// import { factoryDetailsClass } from './factory-details-class.js';
import { factoryExactSpace } from './factory-exact-space';
import { factoryTitle } from './factory-title';

const tabbedIndent: string = 'tabbedIndent';
const tabbedBeginSign = codes.equalsTo;
const tabbedBeginSignNum = 3;

// Two features:
// 1. ===! 
// 2. ===+

/*

Syntax:
Tabs start with === to signify a tab followed by a quoted title. 
Consecutive tabs are grouped into a tab set.

=== "Tab1"
    Content 1

=== "Tab2"
    Content 2

Container
- Sign
- Title
- Content
 - Lines
  - Indents
  - Chunk


*/

const tokenizeTabbedContainer: Tokenizer = (effects, ok, nok) => {
    const ctx = this
	let previous: Token;
	let sizeOpen = 0;

	const tabbed: State = (code) => {
		effects.enter('tabbedContainer'); // the whole tab block
		effects.enter('tabbedContainerFence'); // "==="
        effects.enter('tabbedContainerSequence'); // "=== "
		if (code === tabbedBeginSign) {
			return tabbedSign(code);
		} else {
			return nok(code);
		}
	};

	const tabbedSign: State = (code) => {
		if (code === tabbedBeginSign) {
			effects.consume(code);
			sizeOpen++;
			return tabbedSign;
		}
		if (sizeOpen < tabbedBeginSignNum) return nok(code);
		effects.exit('tabbedContainerSequence');
		return tabbedTitle;
	};

    const tabbedTitle: State = (code) => {
        if (code !== codes.space) {
            return nok(code);
        }
        effects.exit('tabbedContainerFence');
        
        // deal with tab title
        return factorySpace(
            effects,
            factoryTitle(effects, titleEnding, nok, "tabbedContainerTitle"),
            types.whitespace,
        )
    }

    const titleEnding: State = (code) => {
        if (code === codes.eof) {
            return containerEnding;
        }
        if (markdownLineEnding(code)) {
            effects.enter(types.lineEnding);
            effects.consume(code);
            effects.exit(types.lineEnding);
            return contentStart;
        }
        return nok(code);
    }

    const contentStart: State = (code) => {
		if (code === codes.eof) {
			effects.exit('tabbedContainer');
			return ok(code);
		}
		effects.enter('tabbedContainerContent');
		return lineStart(code);
	};

	const lineStart: State = (code) => {
		if (code === codes.eof) {
            return contentEnding(code);
        }
		if (!markdownSpace(code)) {
            return contentEnding;
        }
		return factoryExactSpace(effects, chunkStart, nok, tabbedIndent, 4);
	};

	const chunkStart: State = (code) => {
		if (code === codes.eof) {
			return contentEnding(code);
		}
		const token = effects.enter(types.chunkDocument, {
			contentType: constants.contentTypeDocument,
			previous,
		});
		if (previous) previous.next = token;
		previous = token;
		return chunkContinue;
	};

    const chunkContinue: State = (code) => {
		if (code === codes.eof) {
			effects.exit(types.chunkDocument);
			return contentEnding(code);
		}
		if (markdownLineEnding(code)) {
			return lineEnding;
		}
		effects.consume(code);
		return chunkContinue;
	};

    const lineEnding: State = function (code) {
		effects.consume(code); // consume line ending
		effects.exit(types.chunkDocument);
		// self.parser.lazy[token.start.line] = false;
		return lineStart;
	};

    const contentEnding: State = (code) => {
		effects.exit('detailsContainerContent');
		return containerEnding(code);
	};
	const containerEnding: State = (code) => {
		effects.exit('detailsContainer');
		return ok(code);
	};

    return tabbed;

}

const tabbedContainer = {
	tokenize: tokenizeTabbedContainer,
	concrete: true, // Shaoyu: Should this be true?
};

export const syntax: Extension = {
	flow: {
		[tabbedBeginSign]: tabbedContainer,
	},
};

export default syntax;