import type { Blog } from "@prisma/client";
import { Link } from "@remix-run/react";
import { displayTimestamp } from "~/utils/clock";

const BlogList = ({ blogs }: { blogs: Blog[] }) => (
  <main>
    <h1 className="text-2xl font-bold mb-8">Recent Posts</h1>
    <ul>
      {blogs.map((t) => (
        <li key={t.id}>
          <Link
            prefetch="intent"
            to={t.slug}
            className="text-gray-800 underline block mb-2 dark:text-gray-300"
          >
            {t.title} -{" "}
            <span className="italic">{displayTimestamp(t.created_at)}</span>
          </Link>
        </li>
      ))}
    </ul>
  </main>
);

export default BlogList;
