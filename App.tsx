import React, { useState, useMemo } from 'react';
import { PROMPTS } from './data';
import { Category, SortOrder, Prompt } from './types';
import PromptCard from './components/PromptCard';
import RunModal from './components/RunModal';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  
  // Modal State
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);

  // Filter and Sort Logic
  const filteredAndSortedPrompts = useMemo(() => {
    let result = [...PROMPTS];

    // Filter by Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          p.content.toLowerCase().includes(query)
      );
    }

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'az') return a.title.localeCompare(b.title);
      if (sortOrder === 'za') return b.title.localeCompare(a.title);
      // For 'newest' we assume higher ID is newer as manually added
      if (sortOrder === 'newest') return parseInt(b.id) - parseInt(a.id); 
      if (sortOrder === 'oldest') return parseInt(a.id) - parseInt(b.id);
      return 0;
    });

    return result;
  }, [searchQuery, selectedCategory, sortOrder]);

  const stats = useMemo(() => {
    return {
      total: PROMPTS.length,
      displayed: filteredAndSortedPrompts.length,
    };
  }, [filteredAndSortedPrompts.length]);

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Run Prompt Modal */}
      <RunModal 
        prompt={activePrompt} 
        onClose={() => setActivePrompt(null)} 
      />

      {/* Header / Hero */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}>
              <div className="bg-indigo-600 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Prompt<span className="text-indigo-600">DB</span></h1>
                <p className="text-xs text-slate-500">Analyst Grade AI Prompts</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                placeholder="Search prompts by keyword, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters and Controls */}
        <div className="mb-8 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            {Object.values(Category).filter(c => c !== 'All').map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-3">
             <span className="text-sm text-slate-500 hidden sm:inline-block">
               Showing {stats.displayed} of {stats.total} prompts
             </span>
             <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>
             <select
               value={sortOrder}
               onChange={(e) => setSortOrder(e.target.value as SortOrder)}
               className="block w-full pl-3 pr-10 py-1.5 text-sm border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border bg-white shadow-sm cursor-pointer"
             >
               <option value="newest">Newest Added</option>
               <option value="oldest">Oldest Added</option>
               <option value="az">A-Z</option>
               <option value="za">Z-A</option>
             </select>
          </div>
        </div>

        {/* Grid */}
        {filteredAndSortedPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedPrompts.map((prompt) => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                onTagClick={handleTagClick}
                onRun={setActivePrompt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-900">No prompts found</h3>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filter to find what you're looking for.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-400">
            &copy; 2025 AI Analyst PromptDB. All rights reserved. Sourced from expert PDFs.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;