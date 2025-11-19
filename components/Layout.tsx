import React from 'react';
import { ViewState, User, UserRole } from '../types';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Code2,
  Search
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentUser, 
  currentView, 
  setView, 
  onLogout,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="flex h-screen bg-dark-950 text-slate-300 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Code2 className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg tracking-tight">VibeShare</h1>
            <span className="text-xs text-slate-500 font-medium px-1.5 py-0.5 bg-slate-800 rounded-full border border-slate-700">Internal v1.0</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavButton 
            active={currentView === 'DASHBOARD'} 
            onClick={() => setView('DASHBOARD')}
            icon={<LayoutDashboard size={20} />}
            label="Library"
          />
          <NavButton 
            active={currentView === 'CREATE'} 
            onClick={() => setView('CREATE')}
            icon={<PlusCircle size={20} />}
            label="New Entry"
          />
          <NavButton 
            active={currentView === 'PROFILE'} 
            onClick={() => setView('PROFILE')}
            icon={<Settings size={20} />}
            label="My Profile"
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-slate-800/50">
                <img src={currentUser.avatar} alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.role}</p>
                </div>
            </div>
            <button 
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            >
                <LogOut size={16} />
                Sign Out
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-dark-900/50 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search projects, prompts, or tags..." 
                        className="w-full bg-dark-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex items-center gap-4 ml-6">
                <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                    <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full animate-pulse"></span>
                    <span className="sr-only">Notifications</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </button>
            </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            active 
            ? 'bg-brand-500/10 text-brand-500 border border-brand-500/20' 
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
        }`}
    >
        <span className={active ? 'text-brand-500' : 'text-slate-500 group-hover:text-slate-300'}>
            {icon}
        </span>
        {label}
    </button>
);