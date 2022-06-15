import type { Blog } from "@prisma/client";
import invariant from "tiny-invariant";
import { findAllBlogPosts, findOneBlogPost } from "~/repository/blogs.server";
import { parseMarkdownWithHighlight } from "~/utils/markdown.server";

export const getParsedBlogById = async (slug: string): Promise<Blog> => {
  const response = await findOneBlogPost(slug);
  invariant(response?.content);
  return {
    ...response,
    content: parseMarkdownWithHighlight(response.content),
  };
};

export const getRecentBlogTitles = async () => {
  console.time("finding all blog posts");
  const response = await findAllBlogPosts();
  console.timeEnd("finding all blog posts");
  return response || [];
};
