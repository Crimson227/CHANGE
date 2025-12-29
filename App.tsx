import React, { useState, useEffect, useRef } from 'react';
import { Message, UserStatus } from './types';
import { initializeChat, sendMessageStream, resetChat } from './services/geminiService';
import { MessageBubble } from './components/MessageBubble';
import { InputArea } from './components/InputArea';
import { StatusPanel } from './components/StatusPanel';
import { IntroScreen } from './components/IntroScreen';
import { WELCOME_MESSAGE, APP_NAME } from './constants';

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userStatus, setUserStatus] = useState<UserStatus>({
    cp: 0,
    level: 1,
    abilities: ["逻辑补丁(被动)", "基础感知"],
    statusText: "系统初始化完成，等待指令。"
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const startNewStory = () => {
    resetChat();
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: WELCOME_MESSAGE,
      }
    ]);
    setUserStatus({
      cp: 0,
      level: 1,
      abilities: ["逻辑补丁(被动)", "基础感知"],
      statusText: "系统初始化完成。"
    });
  };

  // Initialize chat session on mount
  useEffect(() => {
    if (!initialized.current) {
      startNewStory();
      initialized.current = true;
    }
  }, []);

  const parseStatusUpdate = (fullText: string) => {
    const statusRegex = /---STATUS---([\s\S]*?)$/;
    const match = fullText.match(statusRegex);
    
    if (match && match[1]) {
      try {
        const statusJson = JSON.parse(match[1].trim());
        setUserStatus({
          cp: statusJson.cp || 0,
          level: statusJson.level || 1,
          abilities: statusJson.abilities || [],
          statusText: statusJson.statusText || "状态更新..."
        });
      } catch (e) {
        console.warn("Failed to parse status JSON", e);
      }
    }
  };

  const handleSendMessage = async (text: string) => {
    if (isLoading) return;

    const userMessageId = Date.now().toString();
    const newUserMessage: Message = { id: userMessageId, role: 'user', text };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    // Create a placeholder for the AI response
    const modelMessageId = (Date.now() + 1).toString();
    const newModelMessage: Message = { id: modelMessageId, role: 'model', text: '' };
    setMessages(prev => [...prev, newModelMessage]);

    try {
      let accumulatedText = '';
      
      await sendMessageStream(text, (chunk) => {
        accumulatedText += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === modelMessageId 
              ? { ...msg, text: accumulatedText }
              : msg
          )
        );
      });
      
      // After stream is complete, check for status update
      parseStatusUpdate(accumulatedText);

    } catch (error) {
      console.error("Failed to generate response", error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === modelMessageId 
            ? { ...msg, text: "【系统连接中断】\nERROR: NETWORK_FAILURE", isError: true }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasEntered) {
    return <IntroScreen onComplete={() => setHasEntered(true)} />;
  }

  return (
    // Main Container: Light Pastel Gradient
    <div className="flex h-screen bg-gradient-to-br from-[#fdfbf7] via-[#f3f4f6] to-[#e0f2fe] text-slate-800 overflow-hidden font-sans-sc relative selection:bg-[#ff00ff] selection:text-white">
      {/* Global Background Elements */}
      <div className="scanlines"></div>
      <div className="vapor-grid"></div>
      
      {/* Sidebar - Fixed width on Desktop */}
      <aside className="hidden md:flex w-80 flex-none z-30 relative shadow-[4px_0_0_rgba(0,0,0,0.05)] border-r border-white/50">
        <StatusPanel status={userStatus} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-20 min-w-0">
        
        {/* Header - Glassmorphic Light */}
        <header className="flex-none px-6 py-4 border-b border-white/60 bg-white/40 backdrop-blur-md flex justify-between items-center shadow-sm z-30">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gradient-to-br from-[#ff00ff] to-[#0099cc] rounded-lg flex items-center justify-center retro-shadow transform rotate-3">
               <span className="font-sans-sc font-bold text-lg text-white">逻</span>
            </div>
            <div className="flex flex-col">
               <h1 className="text-xl font-black italic tracking-wider text-slate-800" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.1)" }}>{APP_NAME}</h1>
               <span className="text-[10px] text-slate-500 font-pixel tracking-[0.3em] -mt-1 uppercase">Reality Rewriter</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Mobile Status Indicator */}
            <div className="md:hidden flex items-center gap-2 text-[#0099cc] font-pixel text-xl bg-white/50 px-3 py-1 rounded-full border border-white">
               <span>CP:</span>
               <span>{userStatus.cp}</span>
            </div>
            
            <button 
              onClick={startNewStory}
              className="group relative px-5 py-2 overflow-hidden rounded-full bg-white border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-white transition-all retro-shadow hover:translate-y-0.5 hover:shadow-none font-bold text-xs tracking-widest uppercase"
            >
              RESTART
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto w-full px-2 md:px-0 scroll-smooth custom-scrollbar">
          <div className="min-h-full p-4 flex flex-col w-full max-w-4xl mx-auto pb-8">
            {messages.map((msg, index) => (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                onOptionSelect={handleSendMessage}
                isLast={index === messages.length - 1}
              />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </main>

        {/* Input Area */}
        <footer className="flex-none w-full bg-gradient-to-t from-white/90 via-white/50 to-transparent pb-8 pt-10 px-4 z-30">
           <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
        </footer>
      </div>
    </div>
  );
};

export default App;