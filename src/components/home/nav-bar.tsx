import { SiDatabricks } from 'react-icons/si';

const Navbar: React.FC = () => {
  return (
    <>
      <header>
        <nav className="bg-Light-[#FAFAFA] fixed z-50 w-full border-b border-[#EAEAEA] bg-white shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-center py-3 text-lg font-medium text-black sm:text-xl">
            <SiDatabricks className="mr-1.5 text-2xl sm:text-3xl" />
            <span>d3d</span>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
