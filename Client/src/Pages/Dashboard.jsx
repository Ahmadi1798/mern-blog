import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Profile from '../Components/Profile';
import DashSidebar from '../Components/DashSidebar';
import Dashposts from '../Components/Dashposts';
import Users from '../Components/Users';
import DashComments from '../Components/DashComments';
import DashboardComp from '../Components/DashboardComp';

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
     min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 transition-all duration-300"
    >
      {/* sidebar */}
      <DashSidebar />
      {/* profile */}
      <div className="md:w-4/5 min-h-screen">
        {tab === 'profile' && <Profile />}
        {/* posts */}
        {tab === 'posts' && <Dashposts />}
        {/* Users */}
        {tab === 'users' && <Users />}
        {/* Comments */}
        {tab === 'comments' && <DashComments />}
        {/* Dash */}
        {tab === 'dash' && <DashboardComp />}
      </div>
    </div>
  );
};
export default Dashboard;
