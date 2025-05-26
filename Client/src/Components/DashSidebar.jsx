import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from 'flowbite-react';
import { HiUser, HiLogout, HiDocumentText } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { logout } from '../Redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

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
    <Sidebar className="w-full ">
      <SidebarItems>
        <SidebarItemGroup className="flex flex-col gap-0.5">
          <Link to="/dashboard?tab=profile">
            <SidebarItem
              active={tab === 'profile'}
              icon={HiUser}
              label={currentUser.isAdmin ? 'Admin' : 'User'}
              labelColor="dark"
              as="div"
            >
              Profile
            </SidebarItem>
          </Link>
          {currentUser?.isAdmin && (
            <Link to={'/dashboard?tab=posts'}>
              <SidebarItem
                active={tab === 'posts'}
                icon={HiDocumentText}
                labelColor="dark"
                as="div"
              >
                Posts
              </SidebarItem>
            </Link>
          )}

          <SidebarItem onClick={handleLogoutUser} icon={HiLogout}>
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
};
export default DashSidebar;
