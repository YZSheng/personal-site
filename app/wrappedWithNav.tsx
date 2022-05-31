import { Link } from "@remix-run/react";

const WrappedWithNav = ({ children }: { children: React.ReactNode }) => {
  const menuStyle = `py-3 text-sm text-gray-500 hover:text-gray-800 mr-6 inline-block`;
  return (
    <div className="container flex min-h-screen flex-col mx-auto py-8 px-8 max-w-5xl sm:px-16">
      <div className="flex-grow">{children}</div>
      <div className="flex py-4 border-t border-gray-400">
        <Link to="/" className={menuStyle}>
          Home
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
      </div>
    </div>
  );
};

export default WrappedWithNav;
