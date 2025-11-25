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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (prompt) {
      // Regex to find content inside square brackets, e.g., [Company Name]
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
      setResult(null);
      setError(null);
    }
  }, [prompt]);

  if (!prompt) return null;

  const handleInputChange = (variable: string, value: string) => {
    setInputs(prev => ({ ...prev, [variable]: value }));
  };

  const executePrompt = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Replace variables in content
      let finalContent = prompt.content;
      Object.entries(inputs).forEach(([key, value]) => {
        // Escaping brackets for regex replacement
        const regex = new RegExp(`\\[${key}\\]`, 'g');
        finalContent = finalContent.replace(regex, value || `[${key}]`);
      });

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: finalContent,
      });

      setResult(response.text || "No response generated.");
    } catch (err: any) {
      setError(err.message || "Failed to generate content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                  Run: {prompt.title}
                </h3>
                
                {/* Variable Inputs */}
                {variables.length > 0 && !result && (
                  <div className="mt-4 bg-blue-50 p-4 rounded-md border border-blue-100">
                    <p className="text-sm text-blue-800 mb-3 font-medium">Fill in the placeholders to run this prompt:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {variables.map(variable => (
                        <div key={variable}>
                          <label className="block text-xs font-medium text-blue-900 uppercase tracking-wide mb-1">{variable}</label>
                          <input
                            type="text"
                            value={inputs[variable]}
                            onChange={(e) => handleInputChange(variable, e.target.value)}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder={`Enter ${variable}...`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="mt-8 flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-sm text-slate-500">Gemini is thinking...</p>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Result Display */}
                {result && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                       <h4 className="text-sm font-semibold text-slate-700">Gemini Response:</h4>
                       <button 
                         onClick={() => {
                             navigator.clipboard.writeText(result);
                         }}
                         className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                       >
                         Copy Result
                       </button>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 overflow-y-auto max-h-[60vh] custom-scrollbar shadow-inner">
                      <pre className="whitespace-pre-wrap text-sm text-slate-800 font-sans leading-relaxed">
                        {result}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
            {!result && !loading && (
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={executePrompt}
              >
                Run with Gemini
              </button>
            )}
            {result && (
               <button
               type="button"
               className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-slate-800 text-base font-medium text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:ml-3 sm:w-auto sm:text-sm"
               onClick={() => { setResult(null); setError(null); }}
             >
               Reset
             </button>
            )}
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunModal;