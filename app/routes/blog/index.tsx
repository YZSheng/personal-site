import type { Blog } from "@prisma/client";
import { json } from "@remix-run/node";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BlogList from "~/components/BlogList";
import { getRecentBlogTitles } from "~/services/blogs.server";

type LoaderData = { blogs: Pick<Blog, "id" | "slug" | "title">[] };

export const loader: LoaderFunction = async () => {
  const blogs = await getRecentBlogTitles();
  return json<LoaderData>(
    { blogs },
    {
      headers: {
        "cache-control": "public, max-age=3600",
      },
    }
  );
};

export const meta: MetaFunction = () => {
  return {
    title: "Blog posts by Yunzhou",
  };
};

export function headers() {
  return {
    "Cache-Control": "public, max-age=3600",
  };
}

export default function BlogPage() {
  const { blogs } = useLoaderData<LoaderData>();
  return <BlogList blogs={blogs} />;
}
