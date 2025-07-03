import {
  Navbar,
  TextInput,
  Button,
  NavbarToggle,
  NavbarCollapse,
  NavbarLink,
  Dropdown,
  DropdownHeader,
  DropdownItem,
  DropdownDivider,
  Avatar,
} from 'flowbite-react';
import { HiOutlineUserCircle, HiLogout } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { GoSearch } from 'react-icons/go';
import { CiDark, CiLight } from 'react-icons/ci';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../Redux/theme/themeSlice';
import { logout } from '../Redux/user/userSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/api';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setsearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const path = useLocation().pathname;
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get('searchTerm');
    if (searchTermFromURL) {
      setsearchTerm(searchTermFromURL);
    }
  }, [location.search]);

  const handleClick = () => {
    dispatch(toggleTheme());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setShowMobileSearch(false); // Close mobile search after submit
  };

  const handleLogoutUser = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success('User logged out Successfully');
      dispatch(logout());
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Navbar className="border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm transition-all duration-200">
      {/* Logo with gradient */}
      <Link to="/" className="flex items-center gap-2 group relative">
        <span className="relative flex items-center">
          {/* Animated gradient text */}
          <span
            className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 bg-clip-text text-transparent dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 animate-gradient-x"
            style={{
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%',
              animation: 'gradient-x 3s ease-in-out infinite',
            }}
          >
            MERN Blog
          </span>
        </span>
        {/* Subtle animated underline */}
        <span className="absolute left-0 -bottom-1 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-60 rounded-full blur-sm animate-pulse hidden sm:block"></span>
        <style>
          {`
            @keyframes gradient-x {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
          `}
        </style>
      </Link>
      {/* Search input */}
      <form
        className={`flex-1 flex justify-center ${
          showMobileSearch
            ? 'absolute left-0 top-0 w-full px-4 py-2 bg-white dark:bg-zinc-900 z-50'
            : 'hidden sm:flex'
        }`}
        style={{ maxWidth: showMobileSearch ? '100%' : undefined }}
        onSubmit={handleSubmit}
      >
        <TextInput
          size="sm"
          type="text"
          placeholder="Search..."
          className="w-full max-w-xs rounded-full border-none bg-zinc-100 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-400 dark:focus:ring-purple-600 transition-all mx-2"
          rightIcon={GoSearch}
          value={searchTerm}
          onChange={(e) => setsearchTerm(e.target.value)}
          autoFocus={showMobileSearch}
        />
        {/* Close button for mobile search */}
        {showMobileSearch && (
          <Button
            type="button"
            color="light"
            size="sm"
            className="ml-2"
            onClick={() => setShowMobileSearch(false)}
          >
            ✕
          </Button>
        )}
      </form>
      {/* Mobile search icon (only show if input is not open) */}
      <div className="hidden sm:flex">
        {!showMobileSearch && (
          <Button
            color="light"
            size="sm"
            className="sm:hidden rounded-full p-2 mx-2"
            onClick={() => setShowMobileSearch(true)}
          >
            <GoSearch />
          </Button>
        )}
      </div>
      {/* Right side controls */}
      <div className="flex items-center gap-2 md:order-2">
        {/* Theme toggle - now visible on all screens */}
        <Button
          size="sm"
          className="cursor-pointer flex items-center justify-center rounded-full mx-1 p-2 transition-colors duration-150 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          onClick={handleClick}
          color="light"
        >
          {theme === 'light' ? (
            <CiLight className="text-xl" />
          ) : (
            <CiDark className="text-xl" />
          )}
        </Button>
        {/* User dropdown or sign up */}
        <div className="">
          {currentUser ? (
            <Dropdown
              dismissOnClick={true}
              arrowIcon={false}
              rounded
              inline
              label={
                <Avatar
                  alt="user avatar"
                  rounded
                  img={currentUser.profilePicture}
                  className="ring-2 ring-blue-400 dark:ring-purple-600 transition-shadow duration-200"
                />
              }
            >
              <DropdownHeader>
                <span className="block text-sm font-medium truncate">
                  {currentUser.username}
                </span>
                <span className="block text-xs text-zinc-500">
                  {currentUser.email}
                </span>
              </DropdownHeader>
              <DropdownItem icon={HiOutlineUserCircle} as="div">
                <Link to="/dashboard?tab=profile">Profile</Link>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem icon={HiLogout} onClick={handleLogoutUser}>
                Logout
              </DropdownItem>
            </Dropdown>
          ) : (
            <Button
              outline
              className="hover:bg-blue-600 hover:text-white border-blue-600 text-blue-600 transition-all duration-150 rounded-full px-4"
              size="sm"
            >
              <Link to="/sign-up">Sign Up</Link>
            </Button>
          )}
        </div>
        {/* Mobile menu toggle */}
        <NavbarToggle className="ml-2" />
      </div>
      {/* Mobile menu */}
      <NavbarCollapse className="bg-white/95 dark:bg-zinc-900/95 rounded-xl shadow-lg mt-2 p-2 mx-2 border border-zinc-100 dark:border-zinc-800">
        <NavbarLink active={path === '/'} className="text-base" as="div">
          <Link
            to="/"
            className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-150 ${
              path === '/'
                ? 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-blue-700 dark:text-blue-300'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            Home
          </Link>
        </NavbarLink>
        <NavbarLink active={path === '/about'} as="div">
          <Link
            to="/about"
            className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-150 ${
              path === '/about'
                ? 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-blue-700 dark:text-blue-300'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            About
          </Link>
        </NavbarLink>
        <NavbarLink active={path === '/projects'} as="div">
          <Link
            to="/projects"
            className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-150 ${
              path === '/projects'
                ? 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-blue-700 dark:text-blue-300'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            Projects
          </Link>
        </NavbarLink>
        <NavbarLink active={path === '/contact'} as="div">
          <Link
            to="/contact"
            className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-150 ${
              path === '/contact'
                ? 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-blue-700 dark:text-blue-300'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            Contact
          </Link>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
};

export default Header;
