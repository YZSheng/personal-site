import invariant from "tiny-invariant";
import { findAllBlogPosts, findOneBlogPost } from "~/repository/blogs.server";
import { parseMarkdownWithHighlight } from "~/utils/markdown.server";

type HTMLString = string;

export const getParsedBlogById = async (slug: string): Promise<HTMLString> => {
  const response = await findOneBlogPost(slug);
  invariant(response?.content);
  return parseMarkdownWithHighlight(response.content);
};

export const getRecentBlogTitles = async () => {
  console.time("finding all blog posts");
  const response = await findAllBlogPosts();
  console.timeEnd("finding all blog posts");
  return response || [];
};
