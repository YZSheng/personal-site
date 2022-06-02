import { findAllBlogPosts, findOneBlogPost } from "~/repository/blogs.server";
import { parseMarkdownWithHighlight } from "~/utils/markdown.server";

type HTMLString = string;

export type BlogPost = {
  id: string;
  createdAt?: Date;
  modifiedAt?: Date;
  content?: HTMLString;
  title: string;
  slug: string;
};

export const getParsedBlogById = async (slug: string): Promise<HTMLString> => {
  const response = await findOneBlogPost(slug);
  return parseMarkdownWithHighlight(response.body.content);
};

export const getRecentBlogTitles = async (): Promise<BlogPost[]> => {
  const response = await findAllBlogPosts();
  const blogs = response.data as any; // FIXME: add ORM
  return blogs;
};
