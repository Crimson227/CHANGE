import React, { useMemo, useEffect, useRef } from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  onOptionSelect: (option: string) => void;
  isLast: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onOptionSelect, isLast }) => {
  const isUser = message.role === 'user';
  const bubbleRef = useRef<HTMLDivElement>(null);
  
  const { storyText, options } = useMemo(() => {
    if (isUser || !message.text) return { storyText: message.text, options: [] };
    const visibleContent = message.text.split('---STATUS---')[0];
    const parts = visibleContent.split('---OPTIONS---');
    const storyText = parts[0].trim();
    const optionsRaw = parts.length > 1 ? parts[1] : '';
    const options = optionsRaw
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.match(/^\d+\./)) 
      .map(line => line.replace(/^\d+\.\s*/, ''));
    return { storyText, options };
  }, [message.text, isUser]);

  useEffect(() => {
    if (!isUser && isLast && bubbleRef.current) {
        setTimeout(() => {
            bubbleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [isUser]);

  const renderTextWithHighlights = (text: string) => {
    if (!text) return null;
    const parts = text.split(/([“"”][^”"]*[”"])/g);
    return parts.map((part, index) => {
      const isDialogue = part.match(/^[“"”]/);
      if (isDialogue) {
        return (
          <span key={index} className="bg-yellow-100 text-slate-900 px-1 rounded font-bold border-b-2 border-yellow-300 mx-0.5">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (isUser) {
    return (
      <div className="flex w-full justify-end my-6 pr-4 md:pr-8">
        <div className="flex items-center gap-3 font-mono text-sm transform transition-all hover:scale-105">
           <div className="bg-white border-2 border-slate-800 text-slate-800 px-5 py-3 rounded-xl shadow-[4px_4px_0_rgba(30,41,59,0.2)]">
              <span className="text-[10px] text-slate-400 block mb-1 font-bold">USER_COMMAND</span>
              <span className="font-medium tracking-wide text-base">{message.text}</span>
           </div>
           <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold">
             &gt;
           </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={bubbleRef} className="flex w-full justify-center mb-16 fade-in-up group flex-col items-center">
      <div className="w-full max-w-4xl relative px-2 md:px-6">
        {/* Main Story Container - Light Window Style */}
        <div 
          className={`
            w-full
            p-8 md:p-12
            bg-white
            rounded-sm
            border border-slate-200
            retro-shadow
            relative
            overflow-hidden
            ${message.isError ? 'border-red-500 bg-red-50' : ''}
          `}
        >
          {/* Mac OS Window Header Buttons decoration */}
          <div className="absolute top-4 left-4 flex gap-1.5 opacity-50">
             <div className="w-2 h-2 rounded-full border border-slate-300"></div>
             <div className="w-2 h-2 rounded-full border border-slate-300"></div>
             <div className="w-2 h-2 rounded-full border border-slate-300"></div>
          </div>
          
          <div className="prose prose-lg md:prose-xl max-w-none font-serif-sc leading-loose text-slate-700">
             <div className="whitespace-pre-wrap">
               {renderTextWithHighlights(storyText)}
             </div>
          </div>
        </div>
      </div>

      {/* Render Options as Light Retro Buttons */}
      {options.length > 0 && isLast && (
        <div className="w-full max-w-3xl mt-8 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4">
          <div className="flex items-center gap-4 mb-2 opacity-60 justify-center">
             <div className="h-px w-12 bg-slate-300"></div>
             <div className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold">Select Logic Path</div>
             <div className="h-px w-12 bg-slate-300"></div>
          </div>
          
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => onOptionSelect(option)}
              className="
                group relative w-full
                py-4 px-6
                text-left
                bg-white
                border-2 border-transparent hover:border-[#ff00ff]
                shadow-sm hover:shadow-[0_4px_15px_rgba(255,0,255,0.15)]
                rounded-xl
                transition-all duration-300
                flex items-center
                transform hover:-translate-y-1
              "
            >
              <div className="flex items-center gap-5 w-full">
                 <div className="flex-none h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 group-hover:bg-[#ff00ff] group-hover:text-white transition-colors duration-300">
                   <span className="font-pixel text-xl">{index + 1}</span>
                 </div>
                 <span className="text-slate-600 group-hover:text-[#9933ff] font-sans-sc text-lg font-medium transition-colors">
                   {renderTextWithHighlights(option)}
                 </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};