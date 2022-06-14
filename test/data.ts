import { faker } from "@faker-js/faker";

export const aMockBlog = () => ({
  id: faker.datatype.uuid(),
  slug: faker.datatype.string(),
  title: faker.datatype.string(),
});

export const mockBlogs = [aMockBlog(), aMockBlog()];
