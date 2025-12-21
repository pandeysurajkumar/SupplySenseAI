import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { formatDate, addDateFormatListener } from '../utils/dateUtils';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user from local storage
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [userAvatar, setUserAvatar] = useState(localStorage.getItem('userAvatar'));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateFormat, setDateFormat] = useState(localStorage.getItem('dateFormat') || 'MM/DD/YYYY');
  const isAdmin = user.role === 'admin';

  // Listen for user data changes and date format changes
  useEffect(() => {
    // Update current date every minute
    const dateInterval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        setUser(JSON.parse(e.newValue || '{}'));
      } else if (e.key === 'userAvatar') {
        setUserAvatar(e.newValue);
      } else if (e.key === 'dateFormat') {
        setDateFormat(e.newValue || 'MM/DD/YYYY');
      }
    };

    // Listen for custom user update events
    const handleUserUpdate = () => {
      setUser(JSON.parse(localStorage.getItem('user') || '{}'));
      setUserAvatar(localStorage.getItem('userAvatar'));
    };

    // Listen for date format changes
    const cleanupDateFormat = addDateFormatListener((newFormat) => {
      setDateFormat(newFormat);
    });

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleUserUpdate);

    return () => {
      clearInterval(dateInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleUserUpdate);
      cleanupDateFormat();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/app/forecasting', label: 'Forecasting', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { path: '/app/inventory', label: 'Inventory Opt.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { path: '/app/materials', label: 'Materials', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
    { path: '/app/reports', label: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    // Admin only items
    ...(isAdmin ? [
      { path: '/app/suppliers', label: 'Suppliers', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-4h1m-1 4h1m-1-4h1m-1 4h1' },
      { path: '/app/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
    ] : [])
  ];

  const getPageTitle = () => {
    const current = navItems.find(item => item.path === location.pathname);
    return current ? current.label : 'Dashboard Overview';
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} bg-slate-800 text-slate-300 flex flex-col`}>
        <div className="flex items-center justify-between p-4 h-16 border-b border-slate-700">
          <div className="flex items-center">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover border-2 border-teal-400"
              />
            ) : (
              <svg className="h-8 w-auto text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75" />
              </svg>
            )}
            {sidebarOpen && <span className="ml-3 font-semibold text-xl text-white">SUPPLYSENSEAI</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-link flex items-center p-3 text-base font-medium rounded-lg w-full text-left ${location.pathname === item.path ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50'
                }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 mt-auto border-t border-slate-700">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-teal-500 flex items-center justify-center">
              <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75" />
              </svg>
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-semibold text-white">SupplySenseAI</p>
                <p className="text-xs text-slate-400">Supply Chain Intelligence</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center px-6 h-16 bg-white border-b border-slate-200">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-slate-800">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-sm text-slate-500 flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" />
              </svg>
              <span>Last updated: {formatDate(currentDate.toISOString(), dateFormat)} {currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center text-sm font-medium text-slate-600 hover:text-teal-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

