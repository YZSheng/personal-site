import { Link } from "@remix-run/react";

const menuStyle = `py-3 text-sm text-gray-500 hover:text-gray-800 mr-2 sm:mr-6 inline-block underline sm:no-underline`;

export default function Menu() {
  return (
    <div className="flex py-4 border-t border-gray-400">
      <Link to="/" className={menuStyle}>
        Home
      </Link>
      <Link to="blog" className={menuStyle}>
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
        Personal Github
      </a>
      <a
        href="https://www.goodreads.com/review/list/2200405"
        target="_blank"
        className={menuStyle}
      >
        Reading List
      </a>
    </div>
  );
}
