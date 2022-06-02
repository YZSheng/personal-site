import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import styles from "highlight.js/styles/atom-one-dark-reasonable.css";
import { getParsedBlogById } from "~/services/blogs.server";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

type LoaderData = { html: string };

export const loader: LoaderFunction = async () => {
  const html = await getParsedBlogById();
  return json<LoaderData>({ html });
};

export default function Blog() {
  const { html } = useLoaderData();
  return (
    <article
      className="prose prose-slate max-w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    ></article>
  );
}
