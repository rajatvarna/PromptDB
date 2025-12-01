import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Prompt } from '../types';

interface RunModalProps {
  prompt: Prompt | null;
  onClose: () => void;
}

const RunModal: React.FC<RunModalProps> = ({ prompt, onClose }) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [variables, setVariables] = useState<string[]>([]);
  
  // New state for editable final prompt
  const [finalPromptContent, setFinalPromptContent] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (prompt) {
      // Regex to find content inside square brackets
      const matches = prompt.content.match(/\[(.*?)\]/g);
      if (matches) {
        const uniqueVars: string[] = Array.from(new Set(matches.map(m => m.replace(/[\[\]]/g, ''))));
        setVariables(uniqueVars);
        const initialInputs: Record<string, string> = {};
        uniqueVars.forEach(v => initialInputs[v] = '');
        setInputs(initialInputs);
      } else {
        setVariables([]);
        setInputs({});
      }
      // Initialize the preview with raw content
      setFinalPromptContent(prompt.content);
      setResult(null);
      setError(null);
    }
  }, [prompt]);

  // Update the preview whenever inputs change
  useEffect(() => {
    if (!prompt) return;
    let content = prompt.content;
    Object.entries(inputs).forEach(([key, value]) => {
      const regex = new RegExp(`\\[${key}\\]`, 'g');
      content = content.replace(regex, value || `[${key}]`);
    });
    setFinalPromptContent(content);
  }, [inputs, prompt]);

  const handleInputChange = (variable: string, value: string) => {
    setInputs(prev => ({ ...prev, [variable]: value }));
  };

  const optimizePrompt = async () => {
    setOptimizing(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const optimizationPrompt = `
        You are an expert prompt engineer. Improve the following prompt to be more precise, structured, and effective for an LLM. 
        Do not change the intent or the variables (text in [brackets]).
        Return ONLY the improved prompt text.

        Original Prompt:
        ${finalPromptContent}
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: optimizationPrompt,
      });

      if (response.text) {
        setFinalPromptContent(response.text.trim());
      }
    } catch (err: any) {
      setError("Failed to optimize prompt: " + err.message);
    } finally {
      setOptimizing(false);
    }
  };

  const executePrompt = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: finalPromptContent,
      });

      setResult(response.text || "No response generated.");
    } catch (err: any) {
      setError(err.message || "Failed to generate content.");
    } finally {
      setLoading(false);
    }
  };

  if (!prompt) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl leading-6 font-bold text-slate-900" id="modal-title">
                    Run: {prompt.title}
                  </h3>
                  <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  
                  {/* Left Column: Configuration */}
                  <div className="w-full lg:w-1/3 flex flex-col gap-4">
                    {/* Variable Inputs */}
                    {variables.length > 0 && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-3">Variables</p>
                        <div className="space-y-3">
                          {variables.map(variable => (
                            <div key={variable}>
                              <label className="block text-xs font-medium text-blue-900 mb-1">{variable}</label>
                              <input
                                type="text"
                                value={inputs[variable]}
                                onChange={(e) => handleInputChange(variable, e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-gray-300 rounded-md p-2 border"
                                placeholder={`Enter value...`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                     {/* Prompt Preview & Edit */}
                     <div className="flex-grow flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                           <label className="text-sm font-semibold text-slate-700">Prompt Preview</label>
                           <button 
                             onClick={optimizePrompt}
                             disabled={optimizing || !!result}
                             className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md border transition-colors ${
                               optimizing ? 'bg-indigo-100 text-indigo-400 cursor-wait' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
                             }`}
                             title="Ask AI to improve structure and clarity"
                           >
                              {optimizing ? (
                                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                              )}
                              Magic Optimize
                           </button>
                        </div>
                        <textarea
                          value={finalPromptContent}
                          onChange={(e) => setFinalPromptContent(e.target.value)}
                          className="w-full flex-grow min-h-[200px] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-3 text-sm font-mono text-slate-600 leading-relaxed resize-none"
                        />
                         <p className="text-xs text-slate-400 mt-1 italic">
                           You can edit the prompt text above before running.
                         </p>
                     </div>
                  </div>

                  {/* Right Column: Output */}
                  <div className="w-full lg:w-2/3 border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-6 pt-6 lg:pt-0 min-h-[400px] flex flex-col">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">AI Output</h3>
                    
                    <div className="flex-grow bg-slate-50 rounded-lg border border-slate-200 relative overflow-hidden flex flex-col">
                      
                      {/* Empty State */}
                      {!loading && !result && !error && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-sm font-medium">Ready to run</span>
                         </div>
                      )}

                      {/* Loading State */}
                      {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 backdrop-blur-sm">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                          <p className="text-indigo-600 font-medium animate-pulse">Analyzing with Gemini...</p>
                        </div>
                      )}

                       {/* Error State */}
                      {error && (
                         <div className="p-4 bg-red-50 text-red-700 text-sm border-b border-red-100">
                           <span className="font-bold">Error:</span> {error}
                         </div>
                      )}

                      {/* Result */}
                      {result && (
                         <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
                            <pre className="whitespace-pre-wrap text-sm text-slate-800 font-sans leading-relaxed">
                               {result}
                            </pre>
                         </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                       <div>
                         {result && (
                            <button
                             onClick={() => navigator.clipboard.writeText(result)}
                             className="text-sm text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1"
                            >
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                               </svg>
                               Copy Result
                            </button>
                         )}
                       </div>
                       
                       <div className="flex gap-3">
                         {result ? (
                             <button
                               onClick={() => { setResult(null); setError(null); }}
                               className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 text-sm font-medium transition-colors"
                             >
                               Clear
                             </button>
                         ) : null}
                         <button
                           onClick={executePrompt}
                           disabled={loading}
                           className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                           {loading ? 'Running...' : 'Run Analysis'}
                         </button>
                       </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunModal;