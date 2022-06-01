import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import styles from "highlight.js/styles/atom-one-dark-reasonable.css";
import fs from "fs";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

type LoaderData = { html: string };

export const loader: LoaderFunction = async () => {
  const file = fs.readFileSync("./blogs/unit_testing_clojure_test.md", {
    encoding: "utf8",
  });
  marked.setOptions({
    highlight: function (code, lang) {
      const hljs = require("highlight.js");
      if (hljs.getLanguage(lang)) {
        return hljs.highlight(lang, code).value;
      } else {
        return hljs.highlightAuto(code).value;
      }
    },
  });
  const html = marked.parse(file);
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
