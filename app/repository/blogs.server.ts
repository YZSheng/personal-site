import { Blog } from "@prisma/client";
import { prisma } from "~/db.server";

export const findAllBlogPosts = async (): Promise<
  Pick<Blog, "id" | "slug" | "title">[]
> => {
  return prisma.blog.findMany({
    select: { id: true, slug: true, title: true },
  });
};

export const findOneBlogPost = async (slug: string): Promise<Blog | null> => {
  return prisma.blog.findUnique({
    where: {
      slug,
    },
  });
};
