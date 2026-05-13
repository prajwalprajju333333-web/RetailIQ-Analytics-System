import { Link } from 'react-router-dom';
import { Home, Upload, BarChart3, Target, Globe, BookOpen, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  
  const menuItems = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/upload", icon: Upload, label: "Upload Data" },
    { to: "/segmentation", icon: BarChart3, label: "Segmentation" },
    { to: "/recommendations", icon: Target, label: "Recommendations" },
    { to: "/country-analysis", icon: Globe, label: "Country Analysis" },
    { to: "/methodology", icon: BookOpen, label: "Methodology" },
  ];

  return (
    <div className="w-72 bg-gradient-to-b from-orange-500 via-orange-600 to-red-600 text-white h-screen p-6 shadow-2xl flex flex-col">
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
          <BarChart3 className="w-6 h-6 text-orange-500" />
        </div>
        <h2 className="text-xl font-bold">RetailIQ Analytics</h2>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex items-center p-3 rounded-lg hover:bg-white/20 transition-all duration-200 group"
              >
                <Icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-white/20 pt-4">
        <Link
          to="/profile"
          className="flex items-center p-3 rounded-lg hover:bg-white/20 transition-all duration-200 group mb-4"
        >
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-white/30">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs opacity-75 truncate">{user?.email}</p>
          </div>
        </Link>

        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-xs opacity-90">Indian Retail Intelligence</p>
          <p className="text-xs opacity-75 mt-1">Powered by AI & ML</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;