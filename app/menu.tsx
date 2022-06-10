import { Link } from "@remix-run/react";

const menuStyle = `py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 mr-2 sm:mr-6 inline-block underline sm:no-underline`;

export default function Menu() {
  return (
    <div className="flex py-4 border-t border-gray-400 dark:text-gray-200">
      <Link to="/" className={menuStyle}>
        Home
      </Link>
      <Link prefetch="intent" to="blog" className={menuStyle}>
        Blog
      </Link>
      <Link to="contact" className={menuStyle}>
        Contact
      </Link>
      <a
        href="https://github.com/YZSheng"
        target="_blank"
        className={menuStyle}
      >
        Github
      </a>
      <a
        href="https://www.goodreads.com/review/list/2200405"
        target="_blank"
        className={menuStyle}
      >
        Reading
      </a>
    </div>
  );
}
