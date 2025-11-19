import React, { useState, useCallback } from 'react';
import { VibeEntry, User, AnalysisResult } from '../types';
import { analyzePrompt } from '../services/geminiService';
import { Sparkles, Save, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface EntryFormProps {
  currentUser: User;
  onSave: (entry: Omit<VibeEntry, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'likes' | 'author'>) => void;
  onCancel: () => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ currentUser, onSave, onCancel }) => {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [builderUrl, setBuilderUrl] = useState('');
  const [deployedUrl, setDeployedUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [aiRating, setAiRating] = useState<number | undefined>(undefined);

  const handleAiAnalyze = async () => {
    if (!prompt.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const result: AnalysisResult = await analyzePrompt(prompt);
      setTitle(result.title);
      setDescription(result.summary);
      setTags(prev => Array.from(new Set([...prev, ...result.tags])));
      setAiRating(result.complexityScore);
    } catch (e) {
      setAnalysisError("AI Analysis failed. Please check your API key or try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
        title,
        description,
        prompt,
        builderUrl: builderUrl || undefined,
        deployedUrl: deployedUrl || undefined,
        tags,
        aiSummary: description, // Using description as summary for now
        aiRating
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto bg-dark-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-800 bg-dark-900/50 flex justify-between items-center">
        <div>
            <h2 className="text-xl font-bold text-white">New Vibe Entry</h2>
            <p className="text-sm text-slate-400">Share your builder state and prompts.</p>
        </div>
        <button onClick={onCancel} className="text-slate-500 hover:text-white">
            <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {/* Prompt Section - The Core */}
        <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
                Vibe Prompt <span className="text-red-400">*</span>
            </label>
            <div className="relative">
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-48 bg-dark-950 border border-slate-700 rounded-lg p-4 text-sm font-mono text-slate-300 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all resize-none"
                    placeholder="Paste your full system prompt or instruction set here..."
                    required
                />
                <button
                    type="button"
                    onClick={handleAiAnalyze}
                    disabled={isAnalyzing || !prompt}
                    className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {isAnalyzing ? 'Analyzing...' : 'Magic Fill'}
                </button>
            </div>
            {analysisError && (
                <div className="flex items-center gap-2 text-red-400 text-xs">
                    <AlertCircle size={12} />
                    {analysisError}
                </div>
            )}
            <p className="text-xs text-slate-500">
                Paste your prompt first. Use "Magic Fill" to auto-generate the title, description, and tags using Gemini 2.5 Flash.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Title</label>
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-dark-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="e.g., CRM Dashboard Generator"
                    required
                />
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-300">Summary</label>
                <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-dark-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Brief overview of what this build does..."
                    required
                />
            </div>

            {/* Tags */}
            <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-slate-300">Tags</label>
                <div className="flex flex-wrap gap-2 p-2 bg-dark-800 border border-slate-700 rounded-lg min-h-[42px]">
                    {tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-brand-500/20 text-brand-400 text-xs rounded-md border border-brand-500/30">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-white"><X size={12} /></button>
                        </span>
                    ))}
                    <input 
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        onBlur={addTag}
                        className="flex-1 bg-transparent outline-none text-sm text-white min-w-[100px]"
                        placeholder="Type and press Enter..."
                    />
                </div>
            </div>

            {/* URLs */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Builder URL (Optional)</label>
                <input 
                    type="url" 
                    value={builderUrl}
                    onChange={(e) => setBuilderUrl(e.target.value)}
                    className="w-full bg-dark-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                    placeholder="https://vibe.dev/builder/..."
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Deployed URL (Optional)</label>
                <input 
                    type="url" 
                    value={deployedUrl}
                    onChange={(e) => setDeployedUrl(e.target.value)}
                    className="w-full bg-dark-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                    placeholder="https://my-app.vercel.app"
                />
            </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
            <button 
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-slate-400 hover:text-white font-medium transition-colors"
            >
                Cancel
            </button>
            <button 
                type="submit"
                disabled={!title || !prompt}
                className="flex items-center gap-2 px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-lg shadow-lg shadow-brand-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Save size={18} />
                Save Entry
            </button>
        </div>

      </form>
    </div>
  );
};