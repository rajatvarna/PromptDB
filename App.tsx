import React, { useState, useMemo, useEffect } from 'react';
import { PROMPTS } from './data';
import { Category, SortOrder, Prompt } from './types';
import PromptCard from './components/PromptCard';
import RunModal from './components/RunModal';
import AddPromptModal from './components/AddPromptModal';
import OnboardingTour from './components/OnboardingTour';

const App: React.FC = () => {
  // --- History & State Management for Custom Prompts ---
  const [history, setHistory] = useState<{
    past: Prompt[][];
    present: Prompt[];
    future: Prompt[][];
  }>(() => {
    const saved = localStorage.getItem('promptdb-custom');
    const initialPresent = saved ? JSON.parse(saved) : [];
    return {
      past: [],
      present: initialPresent,
      future: []
    };
  });

  const { past, present: customPrompts, future } = history;

  const updateCustomPrompts = (newPrompts: Prompt[]) => {
    setHistory(curr => ({
      past: [...curr.past, curr.present],
      present: newPrompts,
      future: []
    }));
    localStorage.setItem('promptdb-custom', JSON.stringify(newPrompts));
  };

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setHistory(curr => ({
      past: newPast,
      present: previous,
      future: [curr.present, ...curr.future]
    }));
    localStorage.setItem('promptdb-custom', JSON.stringify(previous));
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    setHistory(curr => ({
      past: [...curr.past, curr.present],
      present: next,
      future: newFuture
    }));
    localStorage.setItem('promptdb-custom', JSON.stringify(next));
  };

  // Merge static and custom prompts
  const prompts = useMemo(() => [...customPrompts, ...PROMPTS], [customPrompts]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All' | 'Favorites'>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  
  // Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('promptdb-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // UI States
  const [showTour, setShowTour] = useState(false);
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  // Check tour
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('promptdb-tour-completed');
    if (!hasSeenTour) setShowTour(true);
  }, []);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('promptdb-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem('promptdb-tour-completed', 'true');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id]
    );
  };

  const handleSaveCustomPrompt = (promptData: Omit<Prompt, 'id' | 'rating' | 'ratingCount' | 'isCustom'>) => {
    if (editingPrompt) {
      // Update existing prompt
      const updatedPrompts = customPrompts.map(p => 
        p.id === editingPrompt.id 
          ? { ...p, ...promptData } 
          : p
      );
      updateCustomPrompts(updatedPrompts);
      setEditingPrompt(null);
    } else {
      // Create new prompt
      const newPrompt: Prompt = {
        ...promptData,
        id: `custom-${Date.now()}`,
        rating: 0,
        ratingCount: 0,
        isCustom: true
      };
      updateCustomPrompts([newPrompt, ...customPrompts]);
    }
  };

  const handleDeleteCustomPrompt = (id: string) => {
    const updatedPrompts = customPrompts.filter(p => p.id !== id);
    updateCustomPrompts(updatedPrompts);
  };

  const handleEditCustomPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setShowAddModal(true);
  };

  // Filter and Sort Logic
  const filteredAndSortedPrompts = useMemo(() => {
    let result = [...prompts];

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

    // Filter by Category or Favorites
    if (selectedCategory === 'Favorites') {
      result = result.filter(p => favorites.includes(p.id));
    } else if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'az') return a.title.localeCompare(b.title);
      if (sortOrder === 'za') return b.title.localeCompare(a.title);
      // For 'newest', handle mix of numeric string IDs and timestamp string IDs
      if (sortOrder === 'newest') {
         // Custom prompts (timestamps) usually larger/newer than static IDs
         const idA = a.id.startsWith('custom-') ? parseInt(a.id.split('-')[1]) : parseInt(a.id);
         const idB = b.id.startsWith('custom-') ? parseInt(b.id.split('-')[1]) : parseInt(b.id);
         return idB - idA;
      } 
      if (sortOrder === 'oldest') {
        const idA = a.id.startsWith('custom-') ? parseInt(a.id.split('-')[1]) : parseInt(a.id);
        const idB = b.id.startsWith('custom-') ? parseInt(b.id.split('-')[1]) : parseInt(b.id);
        return idA - idB;
      }
      return 0;
    });

    return result;
  }, [searchQuery, selectedCategory, sortOrder, prompts, favorites]);

  const stats = useMemo(() => {
    return {
      total: prompts.length,
      displayed: filteredAndSortedPrompts.length,
    };
  }, [prompts.length, filteredAndSortedPrompts.length]);

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
  };

  const handleRatePrompt = (id: string, newRating: number) => {
    // Only allow rating custom prompts if they are in the list? 
    // Wait, PROMPTS are imported. We can't mutate PROMPTS array directly for persistence.
    // For this demo, we'll just update state, but persistent ratings for static prompts 
    // would require a separate mapping in localStorage.
    // Let's implement local state update for visual feedback.
    
    // Check if it's a custom prompt
    if (id.startsWith('custom-')) {
       const updated = customPrompts.map(p => {
         if (p.id === id) {
           const newCount = p.ratingCount + 1;
           const newAvg = ((p.rating * p.ratingCount) + newRating) / newCount;
           return { ...p, rating: newAvg, ratingCount: newCount };
         }
         return p;
       });
       updateCustomPrompts(updated);
    } else {
       // For static prompts, we can't persist changes easily without a shadow map
       // But we can trigger re-render for this session
       // (Not strictly implemented for static prompts in this step as requested scope was Custom Undo/Redo)
       console.log("Rating static prompt:", id, newRating);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {showTour && <OnboardingTour onComplete={handleTourComplete} />}

      {/* Modals */}
      <RunModal 
        prompt={activePrompt} 
        onClose={() => setActivePrompt(null)} 
      />
      
      {showAddModal && (
        <AddPromptModal 
          initialData={editingPrompt || undefined}
          onClose={() => {
            setShowAddModal(false);
            setEditingPrompt(null);
          }}
          onSave={handleSaveCustomPrompt}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}>
              <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Prompt<span className="text-indigo-600">DB</span></h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Analyst Grade AI Prompts</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 flex-grow md:flex-grow-0">
               
               {/* Undo/Redo Controls */}
               <div className="flex items-center bg-slate-100 rounded-lg p-1">
                 <button
                   onClick={undo}
                   disabled={past.length === 0}
                   className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                   title="Undo"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
                   </svg>
                 </button>
                 <button
                   onClick={redo}
                   disabled={future.length === 0}
                   className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                   title="Redo"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>
                   </svg>
                 </button>
               </div>

               {/* Search Bar */}
              <div className="relative w-full md:w-80 group" id="tour-search-filter">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all duration-200 shadow-sm"
                  placeholder="Search prompts..."
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
              
              {/* Add Prompt Button */}
              <button 
                onClick={() => {
                  setEditingPrompt(null);
                  setShowAddModal(true);
                }}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Add Prompt</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Mobile Category */}
            <div className="block md:hidden w-full">
              <label htmlFor="category-select" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                Category
              </label>
              <div className="relative">
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Category | 'All' | 'Favorites')}
                  className="appearance-none block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg shadow-sm bg-white"
                >
                  <option value="All">All Categories</option>
                  <option value="Favorites">♥ Favorites</option>
                  {Object.values(Category).filter(c => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Desktop Category */}
            <div className="hidden md:flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-slate-500 mr-2">Filters:</span>
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  selectedCategory === 'All'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                All
              </button>
              
              <button
                onClick={() => setSelectedCategory('Favorites')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border flex items-center gap-1.5 ${
                  selectedCategory === 'Favorites'
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md transform scale-105'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Favorites
              </button>

              <div className="w-px h-5 bg-slate-300 mx-1"></div>

              {Object.values(Category).filter(c => c !== 'All').map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-3 md:ml-auto w-full md:w-auto">
               <span className="text-sm text-slate-500 hidden lg:inline-block whitespace-nowrap">
                 {stats.displayed} prompts
               </span>
               <div className="h-4 w-px bg-slate-300 hidden lg:block"></div>
               <div className="relative w-full md:w-48">
                 <select
                   value={sortOrder}
                   onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                   className="appearance-none block w-full pl-3 pr-10 py-2 text-sm border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg border bg-white shadow-sm cursor-pointer"
                 >
                   <option value="newest">Newest Added</option>
                   <option value="oldest">Oldest Added</option>
                   <option value="az">Name (A-Z)</option>
                   <option value="za">Name (Z-A)</option>
                 </select>
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        {filteredAndSortedPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedPrompts.map((prompt, index) => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                isFavorite={favorites.includes(prompt.id)}
                onToggleFavorite={toggleFavorite}
                onTagClick={handleTagClick}
                onRun={setActivePrompt}
                onRate={handleRatePrompt}
                onDelete={handleDeleteCustomPrompt}
                onEdit={handleEditCustomPrompt}
                tourTargetMap={index === 0 ? { favorite: 'tour-fav-btn', run: 'tour-run-btn' } : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900">No prompts found</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
              {selectedCategory === 'Favorites' 
                ? "You haven't added any favorites yet. Click the heart icon on a prompt to save it here."
                : "We couldn't find any prompts matching your criteria."}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-indigo-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">AI</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">PromptDB</span>
             </div>
             <p className="text-center text-sm text-slate-500">
               &copy; {new Date().getFullYear()} AI Analyst PromptDB. All rights reserved.
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;