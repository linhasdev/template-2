'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import MessageList from '@/components/MessageList';
import ChatInput from '@/components/ChatInput';
import EmptyState from '@/components/EmptyState';
import FloatingVideo from '@/components/FloatingVideo';
import DesmosCalculator from '@/components/DesmosCalculator';
import Sidebar from '@/components/Sidebar';

export default function ChatPage() {
  const [showVideo, setShowVideo] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/openai/chat',
    body: {
      model: 'gpt-4o',
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  const toggleCalculator = () => {
    setShowCalculator(!showCalculator);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onExpand={(expanded) => setIsSidebarExpanded(expanded)} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        showCalculator ? 'mr-[400px]' : ''
      } ${isSidebarExpanded ? 'ml-40' : 'ml-12'}`}>
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-gray-50"
              aria-label="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={toggleVideo}
              className={`flex items-center gap-2 px-4 h-9 rounded-lg text-base ${
                showVideo 
                  ? 'bg-gray-100 text-gray-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              aria-label={showVideo ? "Close video lecture" : "Open video lecture"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Differential Equations 101</span>
            </button>

            <div className="relative">
              <button
                className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-gray-50 group"
                aria-label="Next"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none -bottom-11">
                  <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-1.5 text-xs font-medium text-gray-600 opacity-0 transform -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-t border-l border-gray-200 transform -rotate-45"></div>
                    next class
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleCalculator}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm ${
                showCalculator 
                  ? 'bg-gray-100 text-gray-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              aria-label={showCalculator ? "Close calculator" : "Open calculator"}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
                />
              </svg>
              <span>Calculator</span>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {messages.length === 0 ? (
              <EmptyState onShowVideo={toggleVideo} />
            ) : (
              <MessageList messages={messages} isLoading={isLoading} />
            )}
            <div ref={messageEndRef} />
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-4 bg-white">
          <ChatInput 
            input={input} 
            handleInputChange={handleInputChange} 
            handleSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
          {error && (
            <div className="text-red-500 text-sm mt-2">
              Error: {error.message || "Something went wrong. Please try again."}
            </div>
          )}
        </div>
      </div>
      
      {/* Desmos Calculator */}
      <DesmosCalculator 
        isOpen={showCalculator} 
        onToggle={toggleCalculator} 
      />
      
      {/* Floating Video Player */}
      {showVideo && (
        <FloatingVideo 
          videoSrc="https://www.youtube.com/embed/6o7b9yyhH7k?si=kpurbGIyshgja-Yv"
          title="YouTube video player"
          onClose={() => setShowVideo(false)}
          isSidebarExpanded={isSidebarExpanded}
          onAskQuestion={(question) => {
            handleInputChange({ target: { value: question } } as any);
            // Focus the chat input
            const chatInput = document.querySelector('textarea');
            if (chatInput) {
              chatInput.focus();
            }
          }}
        />
      )}
    </div>
  );
}
