import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DarkModeSwitcher from './Header/DarkModeSwitcher';
import Logo from '../images/logo/logo1.png';

const PublicNavbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Helper for styling: normal black, hover/active pale yellow
  // Using a visible yellow-gold (#EAB308) for "pale yellow" to ensure readability on white bg
  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    const base = "text-base font-medium transition-colors duration-200";
    // Active/Hover color: #EAB308 (Yellow-500)
    // Normal color: text-black dark:text-white
    const colorClass = isActive 
      ? "text-[#EAB308] dark:text-[#FDE047]" 
      : "text-black dark:text-white hover:text-[#EAB308] dark:hover:text-[#FDE047]";
    
    return `${base} ${colorClass}`;
  };

  return (
  <nav className="sticky top-0 z-50 w-full border-b border-stroke bg-white/90 backdrop-blur dark:border-strokedark dark:bg-boxdark">
  <div className="mx-auto max-w-screen-2xl px-4 py-3 md:px-6 2xl:px-11">

    {/* Main Flex */}
    <div className="flex items-center justify-between gap-8">

      {/* Logo */}
    <div className="flex items-center gap-3">
  <Link to="/home" className="flex items-center gap-3">
    <img
      src={Logo}
      alt="CourierTrackr Logo"
      className="h-10 sm:h-12 md:h-14 w-auto object-contain"
    />

    <span className="font-extrabold text-lg sm:text-xl md:text-2xl tracking-tight text-gray-900 dark:text-white">
      couriertrackr.in
    </span>
  </Link>
</div>


      {/* Desktop Menu */}
      <div className="hidden md:flex md:items-center md:gap-8">
        <Link to="/home" className={getLinkClass('/home')}>Home</Link>
        <Link to="/about" className={getLinkClass('/about')}>About</Link>
     
        <Link to="/contact" className={getLinkClass('/contact')}>Contact</Link>
      </div>

      {/* Dark Mode + Auth Buttons + Mobile Toggle */}
      <div className="flex items-center gap-3">
        <ul className="hidden items-center gap-3 md:flex">
          <DarkModeSwitcher />
        </ul>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/auth/signin" className="inline-flex items-center rounded border border-stroke px-4 py-2 text-base font-medium text-black hover:bg-gray dark:border-strokedark dark:text-white dark:hover:bg-meta-4">
            Sign In
          </Link>
        </div>

        {/* Mobile Toggle Button - Moved to Right Side */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg border border-stroke p-2 text-black hover:bg-gray dark:border-strokedark dark:text-white dark:hover:bg-meta-4 md:hidden"
          aria-label="Toggle navigation"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 20 20">
            <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

    </div>

    {/* Mobile Menu */}
    {open && (
      <div className="mt-3 md:hidden">
        <div className="grid grid-cols-1 gap-2">
          <Link onClick={() => setOpen(false)} to="/home" className={`rounded px-3 py-2 ${getLinkClass('/home')}`}>Home</Link>
          <Link onClick={() => setOpen(false)} to="/about" className={`rounded px-3 py-2 ${getLinkClass('/about')}`}>About</Link>
          
          <Link onClick={() => setOpen(false)} to="/contact" className={`rounded px-3 py-2 ${getLinkClass('/contact')}`}>Contact</Link>

          <div className="flex items-center justify-between rounded border border-stroke px-3 py-2 dark:border-strokedark">
            <span className="text-base font-medium text-black dark:text-white">Theme</span>
            <DarkModeSwitcher />
          </div>

          <div className="flex items-center gap-2">
            <Link onClick={() => setOpen(false)} to="/auth/signin" className="inline-flex flex-1 items-center justify-center rounded border border-stroke px-4 py-2 text-base font-medium text-black hover:bg-gray dark:border-strokedark dark:text-white dark:hover:bg-meta-4">
              Sign In
            </Link>
           
          </div>
        </div>
      </div>
    )}

  </div>
</nav>
  );
};

export default PublicNavbar;

