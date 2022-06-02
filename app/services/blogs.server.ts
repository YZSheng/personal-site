import fs from "fs";
import { parseMarkdownWithHighlight } from "~/utils/markdown.server";

type HTMLString = string;

export type BlogPost = {
  id: string;
  createdAt?: Date;
  modifiedAt?: Date;
  content?: HTMLString;
  title: string;
};

const blogs: BlogPost[] = [
  {
    id: "clojure_test_for_jest_junit",
    title: "Translation of clojure.test to JavaScript / Java developers",
  },
  {
    id: "unit_testing_clojure_test",
    title: "Unit Testing in Clojure",
  },
];

export const getParsedBlogById = async (id: string): Promise<HTMLString> => {
  const file = await fs.promises.readFile(`./blogs/${id}.md`, {
    encoding: "utf8",
  });
  return parseMarkdownWithHighlight(file);
};

export const getRecentBlogTitles = async (): Promise<BlogPost[]> => {
  // migrate to DB
  return blogs;
};
