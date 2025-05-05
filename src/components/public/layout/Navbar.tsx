import { SiDatabricks } from 'react-icons/si';

const Navbar: React.FC<{}> = ({}) => {
  return (
    <>
      <header>
        <nav className="bg-Light-[#FAFAFA] fixed z-50 w-full border-b border-[#EAEAEA] bg-white/75 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-center py-3 text-lg font-medium sm:text-xl">
            <SiDatabricks className="mr-1.5 text-2xl sm:text-3xl" />
            <span>Data3D</span>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
