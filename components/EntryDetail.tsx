import React, { useState } from 'react';
import { VibeEntry } from '../types';
import { ArrowLeft, Copy, ExternalLink, GitFork, Share2, Check } from 'lucide-react';

interface EntryDetailProps {
  entry: VibeEntry;
  onBack: () => void;
}

export const EntryDetail: React.FC<EntryDetailProps> = ({ entry, onBack }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(entry.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group"
        >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Library
        </button>

        <div className="bg-dark-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
            {/* Header Banner */}
            <div className="p-8 border-b border-slate-800 bg-gradient-to-r from-dark-900 to-slate-900 relative">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            {entry.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium">
                                    {tag}
                                </span>
                            ))}
                            {entry.aiRating && (
                                <span className="px-2.5 py-0.5 rounded-full bg-brand-900/30 border border-brand-500/30 text-xs text-brand-400 font-medium">
                                    Complexity: {entry.aiRating}/10
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">{entry.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <img src={entry.author.avatar} className="w-5 h-5 rounded-full" alt="" />
                                <span>{entry.author.name}</span>
                            </div>
                            <span>•</span>
                            <span>Updated {new Date(entry.updatedAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>v{entry.version}.0</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                         <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors" title="Fork Project">
                            <GitFork size={20} />
                        </button>
                        <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors" title="Share">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-800">
                {/* Main Content: Prompt */}
                <div className="col-span-2 p-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Prompt</h3>
                        <button 
                            onClick={handleCopy}
                            className="flex items-center gap-2 text-xs font-medium text-brand-400 hover:text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 px-3 py-1.5 rounded-md transition-colors"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy Prompt'}
                        </button>
                    </div>
                    <div className="relative group">
                         <pre className="bg-dark-950 rounded-lg p-6 text-sm text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto border border-slate-800 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {entry.prompt}
                         </pre>
                    </div>
                    
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                        <p className="text-slate-400 leading-relaxed">
                            {entry.description}
                        </p>
                    </div>
                </div>

                {/* Sidebar: Details & Links */}
                <div className="col-span-1 p-8 space-y-8 bg-dark-900/50">
                    {/* Links Card */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deployments</h4>
                        
                        {entry.builderUrl ? (
                             <a href={entry.builderUrl} target="_blank" rel="noopener noreferrer" className="block p-4 bg-slate-800/50 border border-slate-700 hover:border-brand-500/50 rounded-lg group transition-all">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-semibold text-white group-hover:text-brand-400">Builder Snapshot</span>
                                    <ExternalLink size={14} className="text-slate-500 group-hover:text-brand-500" />
                                </div>
                                <p className="text-xs text-slate-500 truncate">{entry.builderUrl}</p>
                            </a>
                        ) : (
                            <div className="text-sm text-slate-600 italic">No builder URL linked</div>
                        )}

                        {entry.deployedUrl ? (
                            <a href={entry.deployedUrl} target="_blank" rel="noopener noreferrer" className="block p-4 bg-slate-800/50 border border-slate-700 hover:border-green-500/50 rounded-lg group transition-all">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-semibold text-white group-hover:text-green-400">Live Deployment</span>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        <ExternalLink size={14} className="text-slate-500 group-hover:text-green-500" />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 truncate">{entry.deployedUrl}</p>
                            </a>
                         ) : (
                            <div className="text-sm text-slate-600 italic">No deployment URL linked</div>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">About</h4>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-slate-500">Created</dt>
                                <dd className="text-slate-300">{new Date(entry.createdAt).toLocaleDateString()}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-500">Author</dt>
                                <dd className="text-slate-300">{entry.author.name}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-500">Role</dt>
                                <dd className="text-slate-300 text-xs px-2 py-0.5 bg-slate-800 rounded">{entry.author.role}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};