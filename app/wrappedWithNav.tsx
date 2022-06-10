import DarkModeToggle from "./DarkModeToggle";
import Menu from "./menu";

const WrappedWithNav = ({
  dark,
  toggleDarkMode,
  children,
}: {
  dark: Boolean;
  toggleDarkMode: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="container flex min-h-screen flex-col mx-auto px-8 max-w-5xl sm:px-16 ios-full-height dark:text-gray-100">
      <div className="flex-grow mt-12 sm:mt-20 md:mt-24 mb-16 relative">
        {children}
        <DarkModeToggle dark={dark} toggleDarkMode={toggleDarkMode} />
      </div>
      <Menu />
    </div>
  );
};

export default WrappedWithNav;
