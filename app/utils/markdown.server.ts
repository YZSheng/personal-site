import { marked } from "marked";

export const parseMarkdownWithHighlight = (md: string): string => {
  marked.setOptions({
    highlight: function (code, lang) {
      const hljs = require('highlight.js');
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  });
  return marked.parse(md);
};
