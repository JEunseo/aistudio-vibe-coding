import React from 'react';
import { VibeEntry } from '../types';
import { Clock, ExternalLink, Tag, Copy, GitFork, ChevronRight } from 'lucide-react';

interface DashboardProps {
  entries: VibeEntry[];
  onSelectEntry: (entry: VibeEntry) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ entries, onSelectEntry }) => {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Tag className="text-slate-500 w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-white">No entries found</h3>
        <p className="text-slate-400 mt-2 max-w-md">Try adjusting your search terms or create a new entry to get started sharing your Vibe creations.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} onClick={() => onSelectEntry(entry)} />
      ))}
    </div>
  );
};

const EntryCard: React.FC<{ entry: VibeEntry; onClick: () => void }> = ({ entry, onClick }) => {
  return (
    <div 
        onClick={onClick}
        className="group bg-dark-900 border border-slate-800 hover:border-brand-500/50 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10 flex flex-col h-full relative overflow-hidden"
    >
        {/* Background Decor */}
        <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
            <div className="bg-slate-800 text-xs font-mono text-slate-400 px-2 py-0.5 rounded">v{entry.version}.0</div>
        </div>

        {/* Header */}
        <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                     <img src={entry.author.avatar} alt={entry.author.name} className="w-6 h-6 rounded-full border border-slate-600" />
                     <span className="text-xs text-slate-400">{entry.author.name}</span>
                </div>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1 pr-8">{entry.title}</h3>
            <p className="text-slate-400 text-sm mt-1 line-clamp-2 h-10">{entry.aiSummary || entry.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
            {entry.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {tag}
                </span>
            ))}
            {entry.tags.length > 3 && (
                <span className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-500 border border-slate-700">+{entry.tags.length - 3}</span>
            )}
        </div>

        {/* Footer Info */}
        <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(entry.createdAt).toLocaleDateString()}
                </span>
                {entry.aiRating && (
                     <span className="flex items-center gap-1 text-brand-400" title="Complexity Score">
                        <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                        {entry.aiRating}/10
                    </span>
                )}
            </div>
            <ChevronRight size={16} className="text-slate-600 group-hover:text-white transition-transform group-hover:translate-x-1" />
        </div>
    </div>
  );
};