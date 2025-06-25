import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from 'flowbite-react';
import { HiUser, HiLogout, HiDocumentText, HiUserGroup } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { logout } from '../Redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { TfiComments } from 'react-icons/tfi';
import { TbLayoutDashboardFilled } from 'react-icons/tb';
import { FaRegUserCircle } from 'react-icons/fa';

const DashSidebar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      setTab(tab);
    }
  }, [location.search]);

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
    <Sidebar
      className="
        w-full md:w-1/5
        bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900
        shadow-xl md:rounded-xl rounded-b-xl
        flex md:flex-col flex-row
        items-center md:items-stretch
        justify-between md:justify-start
        py-1 md:py-6
        px-1 md:px-2
        min-h-[56px] md:min-h-screen
        md:static fixed bottom-0 left-0 z-20
        md:relative
        transition-all duration-300
        overflow-x-auto
      "
      style={{ height: 'auto' }}
    >
      {/* User Info - only on desktop */}
      <div className="hidden md:flex flex-col items-center mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg mb-2">
          {currentUser?.profilePicture ? (
            <img
              src={currentUser.profilePicture}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover border-4 border-white dark:border-zinc-900"
            />
          ) : (
            <FaRegUserCircle className="text-white text-2xl" />
          )}
        </div>
        <span className="font-bold text-sm text-zinc-800 dark:text-zinc-100">
          {currentUser?.username}
        </span>
        <span className="text-xs text-blue-600 dark:text-blue-300 font-semibold mt-1">
          {currentUser?.isAdmin ? 'Admin' : 'User'}
        </span>
      </div>
      {/* Sidebar Items */}
      <SidebarItems className="w-full overflow-x-auto md:overflow-hidden">
        <SidebarItemGroup className="flex md:flex-col flex-row gap-1 md:gap-1 w-full">
          {currentUser?.isAdmin && (
            <Link to="/dashboard?tab=dash" className="flex-1 min-w-[70px]">
              <SidebarItem
                active={tab === 'dash'}
                icon={TbLayoutDashboardFilled}
                className="rounded-lg transition-all duration-200 hover:bg-blue-100 dark:hover:bg-zinc-700 hover:scale-[1.03] group flex flex-col md:flex-row items-center justify-center md:justify-start py-1 px-1 md:py-2 md:px-2"
                as="div"
              >
                <span className="group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200 text-[10px] md:text-base">
                  Dashboard
                </span>
              </SidebarItem>
            </Link>
          )}
          <Link to="/dashboard?tab=profile" className="flex-1 min-w-[70px]">
            <SidebarItem
              active={tab === 'profile'}
              icon={HiUser}
              className="rounded-lg transition-all duration-200 hover:bg-blue-100 dark:hover:bg-zinc-700 hover:scale-[1.03] group flex flex-col md:flex-row items-center justify-center md:justify-start py-1 px-1 md:py-2 md:px-2"
              as="div"
            >
              <span className="group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200 text-[10px] md:text-base">
                Profile
              </span>
              <span className="ml-1 px-1 py-0.5 rounded-full text-[9px] font-semibold bg-blue-200 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hidden md:inline">
                {currentUser.isAdmin ? 'Admin' : 'User'}
              </span>
            </SidebarItem>
          </Link>
          {currentUser?.isAdmin && (
            <Link to={'/dashboard?tab=posts'} className="flex-1 min-w-[70px]">
              <SidebarItem
                active={tab === 'posts'}
                icon={HiDocumentText}
                className="rounded-lg transition-all duration-200 hover:bg-green-100 dark:hover:bg-green-900 hover:scale-[1.03] group flex flex-col md:flex-row items-center justify-center md:justify-start py-1 px-1 md:py-2 md:px-2"
                as="div"
              >
                <span className="group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-200 text-[10px] md:text-base">
                  Posts
                </span>
              </SidebarItem>
            </Link>
          )}
          {currentUser?.isAdmin && (
            <Link to={'/dashboard?tab=users'} className="flex-1 min-w-[70px]">
              <SidebarItem
                active={tab === 'users'}
                icon={HiUserGroup}
                className="rounded-lg transition-all duration-200 hover:bg-yellow-100 dark:hover:bg-yellow-900 hover:scale-[1.03] group flex flex-col md:flex-row items-center justify-center md:justify-start py-1 px-1 md:py-2 md:px-2"
                as="div"
              >
                <span className="group-hover:text-yellow-700 dark:group-hover:text-yellow-300 transition-colors duration-200 text-[10px] md:text-base">
                  Users
                </span>
              </SidebarItem>
            </Link>
          )}
          {currentUser?.isAdmin && (
            <Link
              to={'/dashboard?tab=comments'}
              className="flex-1 min-w-[70px]"
            >
              <SidebarItem
                active={tab === 'comments'}
                icon={TfiComments}
                className="rounded-lg transition-all duration-200 hover:bg-purple-100 dark:hover:bg-purple-900 hover:scale-[1.03] group flex flex-col md:flex-row items-center justify-center md:justify-start py-1 px-1 md:py-2 md:px-2"
                as="div"
              >
                <span className="group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-200 text-[10px] md:text-base">
                  Comments
                </span>
              </SidebarItem>
            </Link>
          )}
          <SidebarItem
            onClick={handleLogoutUser}
            icon={HiLogout}
            className="rounded-lg transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900 hover:scale-[1.03] group  flex flex-col md:flex-row items-center justify-center md:justify-start py-1 px-1 md:py-2 md:px-2"
          >
            <span className="group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-200 text-[10px] md:text-base">
              Sign Out
            </span>
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
};

export default DashSidebar;
