import { marked } from "marked";

export const parseMarkdownWithHighlight = (md: string): string => {
  marked.setOptions({
    highlight: function (code, lang) {
      const hljs = require("highlight.js");
      if (hljs.getLanguage(lang)) {
        return hljs.highlight(lang, code).value;
      } else {
        return hljs.highlightAuto(code).value;
      }
    },
  });
  return marked.parse(md);
};
