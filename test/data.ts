import { faker } from "@faker-js/faker";
import { Blog } from "@prisma/client";

export const aMockBlog = (): Blog => ({
  id: faker.datatype.uuid(),
  slug: faker.datatype.string(),
  title: faker.datatype.string(),
  created_at: faker.date.past(),
  modified_at: faker.date.past(),
  content: faker.datatype.string(),
});

export const mockBlogs = [aMockBlog(), aMockBlog()];
