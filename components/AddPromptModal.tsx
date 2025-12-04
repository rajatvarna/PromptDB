import React, { useState, useEffect } from 'react';
import { Category, Prompt, PromptVersion } from '../types';
import { PROMPT_TEMPLATES } from '../data';

interface AddPromptModalProps {
  initialData?: Prompt;
  onClose: () => void;
  onSave: (prompt: Omit<Prompt, 'id' | 'rating' | 'ratingCount' | 'isCustom' | 'versions'>) => void;
}

const AddPromptModal: React.FC<AddPromptModalProps> = ({ onClose, onSave, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState<Category>(initialData?.category || Category.INVESTMENT_RESEARCH);
  const [tags, setTags] = useState(initialData?.tags.join(', ') || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [error, setError] = useState('');
  
  const [showHistory, setShowHistory] = useState(false);

  const isEditing = !!initialData;
  const versions = initialData?.versions || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !content) {
      setError('Please fill in all required fields.');
      return;
    }

    const tagList = tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);

    onSave({
      title,
      description,
      category,
      tags: tagList,
      content
    });
    onClose();
  };

  const handleRestore = (version: PromptVersion) => {
    if(confirm(`Restore version from ${new Date(version.timestamp).toLocaleString()}? This will replace current form fields.`)) {
      setTitle(version.title);
      setDescription(version.description);
      setCategory(version.category);
      setTags(version.tags.join(', '));
      setContent(version.content);
      setShowHistory(false);
    }
  };

  const handleApplyTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateTitle = e.target.value;
    if (!templateTitle) return;

    const template = PROMPT_TEMPLATES.find(t => t.title === templateTitle);
    if (template) {
      if (!isEditing || confirm('This will overwrite your current fields with the template data. Continue?')) {
        setTitle(template.title || '');
        setDescription(template.description || '');
        if (template.category) setCategory(template.category);
        setTags(template.tags?.join(', ') || '');
        setContent(template.content || '');
      }
    }
    // Reset select to default
    e.target.value = "";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 flex flex-col h-full">
            <div className="mb-5 border-b border-slate-100 pb-4 flex justify-between items-center">
               <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {isEditing ? 'Edit Custom Prompt' : 'Add Custom Prompt'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {isEditing ? 'Update your prompt details below.' : 'Create your own analyst prompt to save to your library.'}
                  </p>
               </div>
               
               <div className="flex items-center gap-2">
                 {isEditing && versions.length > 0 && (
                   <button 
                     type="button"
                     onClick={() => setShowHistory(!showHistory)}
                     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                       showHistory 
                         ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                         : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                     }`}
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     {showHistory ? 'Back to Editor' : `History (${versions.length})`}
                   </button>
                 )}
               </div>
            </div>

            {showHistory ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                {versions.map((v) => (
                  <div key={v.timestamp} className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-indigo-200 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <span className="text-xs font-semibold text-slate-500 block mb-1">
                           {new Date(v.timestamp).toLocaleString()}
                         </span>
                         <h4 className="text-sm font-bold text-slate-800">{v.title}</h4>
                       </div>
                       <button
                         onClick={() => handleRestore(v)}
                         className="text-xs bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 px-2 py-1 rounded shadow-sm transition-colors"
                       >
                         Restore
                       </button>
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-2 font-mono bg-white p-2 rounded border border-slate-100">
                      {v.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                
                {/* Template Selector */}
                <div className="mb-6 bg-slate-50 p-3 rounded-md border border-slate-200 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700 whitespace-nowrap mr-3">
                    Start from template:
                  </label>
                  <select 
                    onChange={handleApplyTemplate}
                    defaultValue=""
                    className="flex-grow text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md py-1.5"
                  >
                    <option value="" disabled>Select a template...</option>
                    {PROMPT_TEMPLATES.map(t => (
                      <option key={t.title} value={t.title}>{t.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 text-sm"
                      placeholder="e.g., SaaS KPI Analyzer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 text-sm"
                      placeholder="Short summary of what this prompt does..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 text-sm bg-white"
                      >
                        {Object.values(Category).filter(c => c !== 'All').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 text-sm"
                        placeholder="saas, finance, metrics"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prompt Content *</label>
                    <p className="text-xs text-slate-500 mb-2">Use square brackets like [Company] for dynamic variables.</p>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={8}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 text-sm font-mono"
                      placeholder="Act as a financial analyst..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow-sm"
                  >
                    {isEditing ? 'Update Prompt' : 'Save Prompt'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPromptModal;