import Menu from "./menu";

const WrappedWithNav = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container flex min-h-screen flex-col mx-auto px-8 max-w-5xl sm:px-16 ios-full-height">
      <div className="flex-grow mt-12 sm:mt-20 md:mt-24 mb-16 relative">{children}</div>
      <Menu />
    </div>
  );
};

export default WrappedWithNav;
