import type { Blog } from "@prisma/client";
import { prisma } from "~/db.server";

export const findAllBlogPosts = async (): Promise<Blog[]> => {
  return prisma.blog.findMany({
    where: { published: true },
    orderBy: { created_at: "desc" },
  });
};

export const findOneBlogPost = async (slug: string): Promise<Blog | null> => {
  return prisma.blog.findUnique({
    where: { slug, published: true },
  });
};

export const findAllBlogPostsForAdmin = async (): Promise<Blog[]> => {
  return prisma.blog.findMany({
    orderBy: { created_at: "desc" },
  });
};

export const findBlogPostByIdForAdmin = async (
  id: string
): Promise<Blog | null> => {
  return prisma.blog.findUnique({ where: { id } });
};

export const createBlogPost = async (data: {
  title: string;
  slug: string;
  content: string;
  published: boolean;
}): Promise<Blog> => {
  return prisma.blog.create({ data });
};

export const updateBlogPost = async (
  id: string,
  data: { title: string; slug: string; content: string; published: boolean }
): Promise<Blog> => {
  return prisma.blog.update({
    where: { id },
    data: { ...data, modified_at: new Date() },
  });
};

export const deleteBlogPost = async (id: string): Promise<Blog> => {
  return prisma.blog.delete({ where: { id } });
};

export const togglePublishBlogPost = async (
  id: string,
  published: boolean
): Promise<Blog> => {
  return prisma.blog.update({
    where: { id },
    data: { published, modified_at: new Date() },
  });
};
