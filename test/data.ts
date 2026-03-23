import { faker } from "@faker-js/faker";
import { Blog } from "@prisma/client";

export const aMockBlog = (): Blog => ({
  id: faker.string.uuid(),
  slug: faker.lorem.slug(),
  title: faker.lorem.sentence(),
  created_at: faker.date.past(),
  modified_at: faker.date.past(),
  content: faker.lorem.paragraphs(),
});

export const mockBlogs = [aMockBlog(), aMockBlog()];
