import {
  Navbar,
  TextInput,
  Button,
  NavbarToggle,
  NavbarCollapse,
  NavbarLink,
} from 'flowbite-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GoSearch } from 'react-icons/go';
import { CiDark, CiLight } from 'react-icons/ci';
import logo from '../assets/images/logo.png';

const Header = () => {
  const [isLightMode, setIsLightMode] = useState(true);
  const path = useLocation().pathname;
  const handleClick = () => {
    setIsLightMode(!isLightMode);
    document.documentElement.classList.toggle('dark');
  };
  return (
    <Navbar className="border-b border-slate-500 fixed top-0 left-0 right-0 z-50 ">
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
          className="cursor-pointer"
          onClick={handleClick}
          color="light"
        >
          {isLightMode ? <CiLight /> : <CiDark />}
        </Button>
        <Button
          outline
          className="hover:bg-neutral-900 hover:text-white border-neutral-900 text-neutral-900"
          size="sm"
        >
          <Link to="/sign-up">Sign Up</Link>
        </Button>
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
