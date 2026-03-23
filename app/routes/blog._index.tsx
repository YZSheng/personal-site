import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BlogList from "~/components/BlogList";
import { getRecentBlogTitles } from "~/services/blogs.server";

export const loader = async () => {
  const blogs = await getRecentBlogTitles();
  return json(
    { blogs },
    {
      headers: {
        "cache-control": "public, max-age=3600",
      },
    }
  );
};

export const meta: MetaFunction = () => {
  return [{ title: "Blog posts by Yunzhou" }];
};

export function headers() {
  return {
    "Cache-Control": "public, max-age=3600",
  };
}

export default function BlogPage() {
  const { blogs } = useLoaderData<typeof loader>();
  return <BlogList blogs={blogs} />;
}
