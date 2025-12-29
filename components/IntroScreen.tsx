import React, { useEffect, useState } from 'react';

interface IntroScreenProps {
  onComplete: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const bootLogs = [
    "BIOS CHECK... OK",
    "LOADING REALITY ENGINE... OK",
    "BYPASSING MORAL FILTERS... SUCCESS",
    "INJECTING LOGIC PATCH v1.0...",
    "ESTABLISHING NEURAL LINK...",
    "READY TO REWRITE."
  ];

  useEffect(() => {
    let currentLog = 0;
    
    // Log animation
    const logInterval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentLog]]);
        currentLog++;
      }
    }, 500);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(logInterval);
          setTimeout(onComplete, 800); 
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => {
      clearInterval(progressInterval);
      clearInterval(logInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#f0f2f5] flex flex-col items-center justify-center font-pixel text-slate-800 p-8 overflow-hidden">
      {/* Light Noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-multiply"></div>
      
      <div className="max-w-2xl w-full z-10 space-y-12 relative">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1 border-2 border-slate-800 font-bold text-sm tracking-widest bg-white">SYSTEM_BIOS_Rev.98</div>
          <h1 className="text-6xl md:text-8xl font-black tracking-widest text-[#1e293b] drop-shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
            LOGIC.SYS
          </h1>
          <p className="text-xl md:text-2xl tracking-[0.5em] text-[#0099cc] font-sans-sc font-bold">
            逻辑重构系统
          </p>
        </div>

        {/* Logs Window */}
        <div className="bg-white border-2 border-slate-800 p-6 shadow-[8px_8px_0_#cbd5e1]">
          <div className="h-40 font-mono text-lg flex flex-col justify-end overflow-hidden">
            {logs.map((log, i) => (
              <div key={i} className="mb-1 flex items-center">
                <span className="text-[#00cc66] mr-3">✔</span>
                <span className="text-slate-700">{log}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-slate-500 font-bold text-sm">
            <span>INSTALLING...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-4 w-full bg-white border-2 border-slate-800 p-0.5">
            <div 
              className="h-full bg-[#0099cc]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};