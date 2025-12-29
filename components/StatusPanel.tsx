import React from 'react';
import { UserStatus } from '../types';

interface StatusPanelProps {
  status: UserStatus;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ status }) => {
  return (
    <div className="w-full h-full p-6 flex flex-col gap-6 font-sans-sc bg-white/40 backdrop-blur-xl relative overflow-hidden">
      {/* Decorative Background Icon */}
      <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b-2 border-slate-200 pb-4">
        <h2 className="text-3xl font-black italic tracking-tighter text-slate-800 drop-shadow-[2px_2px_0_rgba(255,0,255,0.3)]">
          STATUS
        </h2>
        <div className="flex gap-2 mt-2">
            <div className="h-2 w-2 rounded-full bg-[#ff00ff]"></div>
            <div className="h-2 w-2 rounded-full bg-[#0099cc]"></div>
            <div className="h-2 w-2 rounded-full bg-[#00cc66]"></div>
        </div>
      </div>

      {/* CP Counter Card */}
      <div className="relative group transform hover:-translate-y-1 transition-transform duration-300">
        <div className="absolute top-1 left-1 w-full h-full bg-[#ff00ff] rounded-xl -z-10 opacity-20"></div>
        <div className="relative bg-white border-2 border-slate-100 p-5 rounded-xl retro-shadow">
          <div className="text-[10px] text-slate-400 font-bold tracking-[0.2em] mb-2 uppercase">Cognitive Points</div>
          <div className="flex items-baseline justify-between">
            <span className="text-5xl font-pixel text-slate-800">
              {status.cp.toString().padStart(4, '0')}
            </span>
            <span className="text-xs px-2 py-1 rounded bg-[#00cc66]/10 text-[#00cc66] font-bold">● ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Stats Container */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Level */}
        <div className="bg-white/60 p-4 rounded-lg border border-white shadow-sm flex justify-between items-center">
           <span className="text-xs font-bold text-slate-500 tracking-widest">LEVEL</span>
           <span className="text-2xl font-bold text-[#0099cc] font-pixel">LV.{status.level}</span>
        </div>

        {/* Abilities */}
        <div className="space-y-2">
          <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase pl-1">Unlocked Modules</div>
          <div className="flex flex-wrap gap-2">
            {status.abilities.map((ability, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 text-slate-600 text-xs font-medium rounded-md shadow-sm">
                {ability}
              </span>
            ))}
            {status.abilities.length === 0 && <span className="text-slate-400 text-xs italic px-2">No active modules</span>}
          </div>
        </div>

        {/* System Monitor (Text Box) */}
        <div className="mt-auto bg-[#1f2937] p-4 rounded-lg border-2 border-slate-700 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff00ff] to-[#0099cc]"></div>
          <div className="text-[10px] text-[#00cc66] mb-2 font-mono flex items-center gap-2">
             <span className="animate-pulse">_</span> SYSTEM LOG
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-mono">
            {status.statusText || "Waiting for input..."}
          </p>
          {/* Scanline overlay for just this box */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
        </div>
      </div>
      
      <div className="text-[9px] text-center text-slate-400 font-mono mt-4">
        LOGIC_RECONSTRUCTION_OS_V1.0
      </div>
    </div>
  );
};