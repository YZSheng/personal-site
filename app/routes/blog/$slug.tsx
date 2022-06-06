import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getParsedBlogById } from "~/services/blogs.server";
import styles from "highlight.js/styles/atom-one-dark-reasonable.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

type LoaderData = { html: string };

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, `params.slug is required`);
  const html = await getParsedBlogById(params.slug);
  return json<LoaderData>({ html });
};

export default function BlogPost() {
  const { html } = useLoaderData<LoaderData>();

  return (
    <div>
      <Link to="/blog" className="absolute -top-8 sm:-top-10 text-gray-600 italic">&#8592; Back to posts</Link>
      <article
        className="prose prose-slate max-w-full"
        dangerouslySetInnerHTML={{ __html: html }}
      ></article>
    </div>
  );
}
