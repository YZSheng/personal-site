import type { Blog } from "@prisma/client";
import invariant from "tiny-invariant";
import {
  findAllBlogPosts,
  findOneBlogPost,
  findAllBlogPostsForAdmin,
  findBlogPostByIdForAdmin,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  togglePublishBlogPost,
} from "~/repository/blogs.server";
import { parseMarkdownWithHighlight } from "~/utils/markdown.server";

export const getParsedBlogById = async (slug: string): Promise<Blog> => {
  const response = await findOneBlogPost(slug);
  if (!response) throw new Response("Not Found", { status: 404 });
  invariant(response.content);
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

export const getAdminBlogList = async (): Promise<Blog[]> => {
  return findAllBlogPostsForAdmin();
};

export const getAdminBlogById = async (id: string): Promise<Blog> => {
  const post = await findBlogPostByIdForAdmin(id);
  if (!post) throw new Response("Not Found", { status: 404 });
  return post;
};

export const createBlog = async (data: {
  title: string;
  slug: string;
  content: string;
  published: boolean;
}): Promise<Blog> => {
  return createBlogPost(data);
};

export const updateBlog = async (
  id: string,
  data: { title: string; slug: string; content: string; published: boolean }
): Promise<Blog> => {
  return updateBlogPost(id, data);
};

export const deleteBlog = async (id: string): Promise<Blog> => {
  return deleteBlogPost(id);
};

export const togglePublish = async (
  id: string,
  published: boolean
): Promise<Blog> => {
  return togglePublishBlogPost(id, published);
};
