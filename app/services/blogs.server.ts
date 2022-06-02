import fs from "fs";
import { parseMarkdownWithHighlight } from "~/utils/markdown.server";

type HTMLString = string;

export const getParsedBlogById = async (): Promise<HTMLString> => {
  const file = await fs.promises.readFile(
    "./blogs/unit_testing_clojure_test.md",
    {
      encoding: "utf8",
    }
  );
  return parseMarkdownWithHighlight(file);
};

// export const getRecentBlogTitles = ():
