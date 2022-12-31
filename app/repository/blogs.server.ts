import type { Blog } from "@prisma/client";
import { prisma } from "~/db.server";

export const findAllBlogPosts = async (): Promise<Blog[]> => {
  return prisma.blog.findMany({
    orderBy: { created_at: "desc" },
  });
};

export const findOneBlogPost = async (slug: string): Promise<Blog | null> => {
  return prisma.blog.findUnique({
    where: {
      slug,
    },
  });
};
