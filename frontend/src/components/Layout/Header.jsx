import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar } from 'lucide-react';

const Header = ({ title = '' }) => {
  const { user } = useAuth();
  
  const getFormattedDate = () => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="h-16 border-b border-slate-200/40 bg-white/40 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-base font-extrabold text-slate-800 tracking-wide">{title}</h1>
        {user && (
          <p className="text-[10px] text-slate-500">
            {getGreeting()}, <span className="text-brand-600 font-semibold">{user.name}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Calendar Widget */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 border border-slate-200 text-[10px] text-slate-600 font-bold shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-brand-500" />
          {getFormattedDate()}
        </div>
      </div>
    </header>
  );
};

export default Header;
