import React, { useState, useRef, useEffect } from 'react';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form 
        onSubmit={handleSubmit}
        className={`
          relative flex items-end gap-2 
          bg-white/90 backdrop-blur
          p-2 rounded-2xl
          border-2 
          transition-all duration-300
          retro-shadow
          ${isLoading ? 'border-slate-200 opacity-80' : 'border-white focus-within:border-[#0099cc]'}
        `}
      >
        <div className="pl-3 py-3 text-[#0099cc] animate-pulse">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
             <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
           </svg>
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "Processing logic..." : "Enter Command to Rewrite..."}
          rows={1}
          disabled={isLoading}
          className="w-full bg-transparent text-slate-800 placeholder-slate-400 p-3 outline-none resize-none max-h-[150px] disabled:opacity-50 font-sans-sc text-base tracking-wide"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`
            p-3 mb-0.5 rounded-xl transition-all duration-200 font-bold tracking-wider text-xs
            ${!input.trim() || isLoading 
              ? 'text-slate-400 bg-slate-100 cursor-not-allowed' 
              : 'text-white bg-[#0099cc] hover:bg-[#0088bb] shadow-md'
            }
          `}
        >
           {isLoading ? (
             <span className="block animate-spin">⟳</span>
           ) : (
             "SEND"
           )}
        </button>
      </form>
    </div>
  );
};