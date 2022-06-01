import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import fs from "fs";

type LoaderData = { html: string };

export const loader: LoaderFunction = async () => {
  const file = fs.readFileSync("./blogs/unit_testing_clojure_test.md", {
    encoding: "utf8",
  });
  console.log(file);
  const html = marked(file);
  return json<LoaderData>({ html });
};

export default function Blog() {
  const { html } = useLoaderData();
  return (
    <article
      className="prose prose-slate"
      dangerouslySetInnerHTML={{ __html: html }}
    ></article>
  );
}
