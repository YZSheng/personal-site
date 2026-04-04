import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getParsedBlogById } from "~/services/blogs.server";
import styles from "highlight.js/styles/atom-one-dark-reasonable.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const loader = async ({ params }: { params: { slug?: string } }) => {
  invariant(params.slug, `params.slug is required`);
  const blog = await getParsedBlogById(params.slug); // throws 404 if not found or unpublished
  return json(
    { blog },
    {
      headers: {
        "cache-control": "public, max-age=3600",
      },
    }
  );
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Blog posts by Yunzhou" }];
  }
  return [{ title: data.blog.title }];
};

export function headers() {
  return {
    "Cache-Control": "public, max-age=3600",
  };
}

export default function BlogPost() {
  const { blog } = useLoaderData<typeof loader>();

  return (
    <div>
      <Link
        to="/blog"
        className="absolute -top-8 sm:-top-10 text-gray-600 dark:text-gray-400 italic"
      >
        &#8592; Back to posts
      </Link>
      <article
        className="prose prose-slate max-w-full dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      ></article>
    </div>
  );
}
