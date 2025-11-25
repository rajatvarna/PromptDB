import React, { useState } from 'react';
import { Prompt, Category } from '../types';

interface PromptCardProps {
  prompt: Prompt;
  onTagClick: (tag: string) => void;
  onRun: (prompt: Prompt) => void;
}

const getCategoryColor = (category: Category) => {
  switch (category) {
    case Category.INVESTMENT_RESEARCH: return 'bg-blue-100 text-blue-800 border-blue-200';
    case Category.INDUSTRY_ANALYSIS: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case Category.COMPANY_OPS: return 'bg-amber-100 text-amber-800 border-amber-200';
    case Category.VALUATION: return 'bg-purple-100 text-purple-800 border-purple-200';
    case Category.WRITING: return 'bg-pink-100 text-pink-800 border-pink-200';
    case Category.AUTOMATION: return 'bg-slate-100 text-slate-800 border-slate-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onTagClick, onRun }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden group/card">
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryColor(prompt.category)}`}>
            {prompt.category}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
          {prompt.title}
        </h3>
        
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
          {prompt.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.tags.map(tag => (
            <button 
              key={tag} 
              onClick={() => onTagClick(tag)}
              className="text-xs text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors cursor-pointer"
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 relative group flex-grow">
           <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto custom-scrollbar">
             {prompt.content}
           </pre>
           <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="bg-white p-1.5 rounded-md shadow-sm border border-slate-200 hover:bg-slate-50 focus:outline-none"
                title="Copy prompt"
              >
                {copied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
           </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <button 
          onClick={handleCopy}
          className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${copied ? 'text-green-600' : 'text-slate-600 hover:text-slate-800'}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>

        <button 
          onClick={() => onRun(prompt)}
          className="flex-1 ml-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
           </svg>
           Run with AI
        </button>
      </div>
    </div>
  );
};

export default PromptCard;