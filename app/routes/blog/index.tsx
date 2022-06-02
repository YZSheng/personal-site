import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { BlogPost, getRecentBlogTitles } from "~/services/blogs.server";

type LoaderData = { blogTitles: BlogPost[] };

export const loader: LoaderFunction = async () => {
  const blogTitles = await getRecentBlogTitles();
  await getRecentBlogTitles();
  return json<LoaderData>({ blogTitles });
};

export default function Blog() {
  const { blogTitles } = useLoaderData<LoaderData>();
  return (
    <main>
      <h1 className="text-2xl font-bold mb-8">Recent Posts</h1>
      <ul>
        {blogTitles.map((t) => (
          <li key={t.id}>
            <Link to={t.slug} className="text-gray-800 underline block mb-2">
              {t.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
