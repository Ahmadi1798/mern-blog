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
import logo from '../assets/images/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../Redux/theme/themeSlice';
import { logout } from '../Redux/user/userSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const path = useLocation().pathname;
  const handleClick = () => {
    dispatch(toggleTheme());
  };

  const handleLogoutUser = async () => {
    try {
      await axios.post('/api/v1/auth/logout');
      toast.success('User logged out Successfully');
      dispatch(logout());
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Navbar className="border-b border-slate-500 sticky top-0 z-50   ">
      <Link to="/" className="text-2xl md:text-4xl font-bold text-slate-900">
        <img src={logo} className="w-32" alt="" />
      </Link>
      <form>
        <TextInput
          size="sm"
          type="text"
          placeholder="Search..."
          className="hidden lg:inline "
          rightIcon={GoSearch}
        />
      </form>
      <Button color="light" size="sm" className="sm:hidden">
        <GoSearch />
      </Button>
      <div className="flex items-center gap-2 md:order-2">
        <Button
          size="sm"
          className="cursor-pointer hidden md:block"
          onClick={handleClick}
          color="light"
        >
          {theme === 'light' ? <CiLight /> : <CiDark />}
        </Button>
        {currentUser ? (
          <Dropdown
            dismissOnClick={false}
            arrowIcon={false}
            rounded
            inline
            label={
              <Avatar
                alt="user avatar"
                rounded
                img={currentUser.profilePicture}
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">@{currentUser.username}</span>
            </DropdownHeader>
            <DropdownHeader>
              <span className="block text-sm truncate">
                {currentUser.email}
              </span>
            </DropdownHeader>
            <Link to={'/dashboard?tap=profile'}>
              <DropdownItem icon={HiOutlineUserCircle}>Profile</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem onClick={handleLogoutUser} icon={HiLogout}>
              Log out
            </DropdownItem>
          </Dropdown>
        ) : (
          <Button
            outline
            className=" hover:bg-neutral-900 hover:text-white border-neutral-900 text-neutral-900"
            size="sm"
          >
            <Link to="/sign-up">Sign Up</Link>
          </Button>
        )}
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink active={path === '/'} as="div">
          <Link to="/">Home</Link>
        </NavbarLink>
        <NavbarLink active={path === '/about'} as="div">
          <Link to="/about">About</Link>
        </NavbarLink>
        <NavbarLink active={path === '/projects'} as="div">
          <Link to="/projects">Projects</Link>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
};
export default Header;
