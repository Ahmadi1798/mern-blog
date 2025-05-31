import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Profile from '../Components/Profile';
import DashSidebar from '../Components/DashSidebar';
import Dashposts from '../Components/Dashposts';
import Users from '../Components/Users';

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const ulrParams = new URLSearchParams(location.search);
    const tab = ulrParams.get('tab');
    if (tab) {
      setTab(tab);
    }
  }, [location.search]);

  return (
    <div
      className="flex flex-col md:flex-row
     min-h-screen"
    >
      <div className=" md:w-1/5">
        {/* sidebar */}
        <DashSidebar />
      </div>
      {/* profile */}
      <div className="md:w-4/5">
        {tab === 'profile' && <Profile />}
        {/* posts */}
        {tab === 'posts' && <Dashposts />}
        {/* Users */}
        {tab === 'users' && <Users />}
      </div>
    </div>
  );
};
export default Dashboard;
