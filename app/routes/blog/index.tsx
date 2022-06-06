import { Blog } from "@prisma/client";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getRecentBlogTitles } from "~/services/blogs.server";

type LoaderData = { blogs: Pick<Blog, "id" | "slug" | "title">[] };

export const loader: LoaderFunction = async () => {
  const blogs = await getRecentBlogTitles();
  return json<LoaderData>({ blogs });
};

export const meta: MetaFunction = () => {
  return {
    title: "Blog posts by Yunzhou",
  };
};

export default function Blog() {
  const { blogs } = useLoaderData<LoaderData>();
  return (
    <main>
      <h1 className="text-2xl font-bold mb-8">Recent Posts</h1>
      <ul>
        {blogs.map((t) => (
          <li key={t.id}>
            <Link
              prefetch="intent"
              to={t.slug}
              className="text-gray-800 underline block mb-2"
            >
              {t.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
