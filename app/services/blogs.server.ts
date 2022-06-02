import fs from "fs";
import { parseMarkdownWithHighlight } from "~/utils/markdown.server";

type HTMLString = string;

export const getParsedBlogById = (): HTMLString => {
  const file = fs.readFileSync("./blogs/unit_testing_clojure_test.md", {
    encoding: "utf8",
  });
  return parseMarkdownWithHighlight(file);
};
