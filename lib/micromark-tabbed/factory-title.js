import { markdownLineEnding } from "micromark-util-character";
import { constants } from "micromark-util-symbol/constants.js";
import { types } from "micromark-util-symbol/types.js";
// Title format: "title" (quotation mark included)
export function factoryTitle(effects, ok, nok, type) {
    const title = (code) => {
        if (!markdownLineEnding(code)) {
            effects.consume(code);
            return title;
        }
        effects.exit(types.chunkText);
        effects.exit(type);
        return ok(code);
    };
    return (code) => {
        if (!markdownLineEnding(code)) {
            effects.enter(type);
            effects.enter(types.chunkText, {
                contentType: constants.contentTypeText,
            });
            return title;
        }
        return nok(code);
    };
}
