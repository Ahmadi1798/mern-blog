import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Profile from '../Components/Profile';
import DashSidebar from '../Components/DashSidebar';

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
      className="flex flex-col md:flex-row md:space-x-6
     min-h-screen "
    >
      <div className=" md:w-[20rem]">
        {/* sidebar */}
        <DashSidebar />
      </div>
      {/* profile */}
      {tab && <Profile />}
    </div>
  );
};
export default Dashboard;
