import { Link } from "@remix-run/react";

const BlogList = ({
  blogs,
}: {
  blogs: { id: string; title: string; slug: string }[];
}) => (
  <main>
    <h1 className="text-2xl font-bold mb-8">Recent Posts</h1>
    <ul>
      {blogs.map((t) => (
        <li key={t.id} role="blog-post-link">
          <Link
            prefetch="intent"
            to={t.slug}
            className="text-gray-800 underline block mb-2 dark:text-gray-300"
          >
            {t.title}
          </Link>
        </li>
      ))}
    </ul>
  </main>
);

export default BlogList;
