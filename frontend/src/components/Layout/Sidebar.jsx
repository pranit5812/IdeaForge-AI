import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Compass, FolderHeart, LogOut, Terminal } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Generate Project', path: '/generate', icon: <Compass className="w-5 h-5" /> },
    { name: 'Saved Blueprints', path: '/saved', icon: <FolderHeart className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 py-6 px-4 flex flex-col justify-between border-r border-slate-200/60 bg-white/70 backdrop-blur-xl z-20">
      <div className="space-y-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-md text-white flex items-center justify-center">
            <Terminal className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-extrabold text-lg text-slate-900 tracking-wide">
            IdeaForge <span className="text-brand-600 font-medium text-xs font-mono ml-0.5">AI</span>
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-600 border-l-2 border-brand-500 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900'
                }`
              }
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User profile & logout */}
      <div className="space-y-4 pt-6 border-t border-slate-200/60">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 font-extrabold text-xs uppercase shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate leading-snug">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 font-semibold text-xs"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
