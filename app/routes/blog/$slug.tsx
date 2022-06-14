import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getParsedBlogById } from "~/services/blogs.server";
import styles from "highlight.js/styles/atom-one-dark-reasonable.css";
import { Blog } from "@prisma/client";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

type LoaderData = { blog: Blog };

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  if (!data) {
    return {
      title: "Blog posts by Yunzhou",
    };
  }
  return {
    title: data.blog.title,
  };
};

export function headers() {
  return {
    "Cache-Control": "max-age=3600",
  };
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, `params.slug is required`);
  const blog = await getParsedBlogById(params.slug);
  return json<LoaderData>({ blog });
};

export default function BlogPost() {
  const { blog } = useLoaderData<LoaderData>();

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
