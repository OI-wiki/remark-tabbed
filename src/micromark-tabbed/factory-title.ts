import { markdownLineEnding } from "micromark-util-character";
import { codes } from "micromark-util-symbol/codes";
import { constants } from "micromark-util-symbol/constants.js";
import { types } from "micromark-util-symbol/types.js";
import { Code, Effects, State } from "micromark-util-types";

// Title format: "title" (quotation mark included)
export function factoryTitle(
  effects: Effects,
  ok: State,
  nok: State,
  type: string
): State {
  const title = (code: Code) => {
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
