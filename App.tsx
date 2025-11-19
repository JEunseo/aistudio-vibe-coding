import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { EntryForm } from './components/EntryForm';
import { EntryDetail } from './components/EntryDetail';
import { User, UserRole, VibeEntry, ViewState } from './types';

// Dummy Data for Initialization
const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Engineer',
  avatar: 'https://picsum.photos/seed/alex/200/200',
  role: UserRole.ENGINEER
};

const INITIAL_ENTRIES: VibeEntry[] = [
  {
    id: '1',
    title: 'Sales Dashboard Layout',
    description: 'A responsive grid layout for sales data visualization with dark mode support.',
    prompt: 'Create a React dashboard with a sidebar navigation, a top bar with search, and a main content area displaying 4 charts using Recharts. The theme should be dark mode by default using Tailwind CSS. Include a "Revenue" line chart, "User Growth" bar chart, and "Traffic Source" pie chart.',
    tags: ['dashboard', 'react', 'recharts', 'tailwind'],
    author: MOCK_USER,
    createdAt: Date.now() - 10000000,
    updatedAt: Date.now() - 10000000,
    version: 1,
    likes: 5,
    aiSummary: 'Responsive dark-mode sales dashboard with Recharts visualization.',
    aiRating: 4
  },
  {
    id: '2',
    title: 'JWT Auth Middleware',
    description: 'Node.js Express middleware for handling JWT verification.',
    prompt: 'Write a robust Express.js middleware function in TypeScript to verify JSON Web Tokens. It should handle token expiration, invalid signatures, and extract the user payload to the request object. Include error handling for 401 and 403 scenarios.',
    tags: ['backend', 'security', 'express', 'typescript'],
    author: { ...MOCK_USER, name: 'Sarah Lead', id: 'u2' },
    createdAt: Date.now() - 5000000,
    updatedAt: Date.now(),
    version: 2,
    likes: 12,
    aiSummary: 'Express.js middleware for secure JWT verification and error handling.',
    aiRating: 7
  }
];

const App: React.FC = () => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [entries, setEntries] = useState<VibeEntry[]>(() => {
    const saved = localStorage.getItem('vibe_entries');
    return saved ? JSON.parse(saved) : INITIAL_ENTRIES;
  });
  const [selectedEntry, setSelectedEntry] = useState<VibeEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Effects
  useEffect(() => {
    localStorage.setItem('vibe_entries', JSON.stringify(entries));
  }, [entries]);

  // Handlers
  const handleLogin = () => setUser(MOCK_USER);
  const handleLogout = () => setUser(null);

  const handleSaveEntry = (newEntryData: Omit<VibeEntry, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'likes' | 'author'>) => {
    const newEntry: VibeEntry = {
      ...newEntryData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
      likes: 0,
      author: user!
    };
    setEntries([newEntry, ...entries]);
    setView('DASHBOARD');
  };

  const handleSelectEntry = (entry: VibeEntry) => {
    setSelectedEntry(entry);
    setView('DETAIL');
  };

  // Filtering
  const filteredEntries = useMemo(() => {
    const lowerQ = searchQuery.toLowerCase();
    return entries.filter(e => 
      e.title.toLowerCase().includes(lowerQ) || 
      e.tags.some(t => t.toLowerCase().includes(lowerQ)) ||
      e.author.name.toLowerCase().includes(lowerQ)
    );
  }, [entries, searchQuery]);

  // Render Logic for Unauthenticated State
  if (!user) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-900/20 via-dark-950 to-dark-950"></div>
        <div className="relative z-10 text-center p-8 max-w-md w-full bg-dark-900/50 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-brand-500/30">
             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">VibeShare</h1>
          <p className="text-slate-400 mb-8">Internal Platform for Vibe Coding outputs.</p>
          <button 
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg shadow-lg shadow-brand-500/20 transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <span>SSO Login</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <p className="mt-4 text-xs text-slate-600">Authorized Personnel Only</p>
        </div>
      </div>
    );
  }

  // Render Authenticated Layout
  return (
    <Layout 
      currentUser={user} 
      currentView={view} 
      setView={setView} 
      onLogout={handleLogout}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      <div className="max-w-7xl mx-auto">
        {view === 'DASHBOARD' && (
          <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Library</h2>
                <span className="text-sm text-slate-500">{filteredEntries.length} entries</span>
            </div>
            <Dashboard entries={filteredEntries} onSelectEntry={handleSelectEntry} />
          </>
        )}

        {view === 'CREATE' && (
          <EntryForm 
            currentUser={user} 
            onSave={handleSaveEntry} 
            onCancel={() => setView('DASHBOARD')} 
          />
        )}

        {view === 'DETAIL' && selectedEntry && (
          <EntryDetail 
            entry={selectedEntry} 
            onBack={() => setView('DASHBOARD')} 
          />
        )}
        
        {view === 'PROFILE' && (
            <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto rounded-full bg-slate-800 mb-4 flex items-center justify-center text-3xl">
                    🚧
                </div>
                <h3 className="text-xl text-white font-semibold">Profile Settings</h3>
                <p className="text-slate-500 mt-2">This module is under construction.</p>
            </div>
        )}
      </div>
    </Layout>
  );
};

export default App;