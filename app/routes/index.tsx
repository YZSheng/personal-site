import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Hi, I'm Sheng Yunzhou.</h1>
      <p className="my-4">
        Most people call me YZ{" "}
        <span className="italic">
          (short for Yunzhou, which is rather challenging to pronounce if you do
          not speak Chinese)
        </span>
        .
      </p>
      <p className="my-4">
        I am a Software Engineer based in Singapore. I enjoy writing client
        facing apps on web, iOS and Android. I'm also facinated by Clojure.
      </p>
      <p className="my-4">
        I sometimes write about my learnings and thoughts on my{" "}
        <Link prefetch="intent" to="blog" className="font-semibold underline">blog</Link>.
      </p>
    </div>
  );
}
