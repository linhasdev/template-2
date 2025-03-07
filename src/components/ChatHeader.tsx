import { useState, useEffect } from 'react';

interface ChatHeaderProps {
  modelName: string;
  setModelName: (model: string) => void;
  onToggleCalculator?: () => void;
  calculatorOpen?: boolean;
}

export default function ChatHeader({ 
  onToggleCalculator, 
  calculatorOpen = false 
}: ChatHeaderProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-2 flex justify-end">
      {onToggleCalculator && (
        <button
          onClick={onToggleCalculator}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm ${
            calculatorOpen 
              ? 'bg-gray-100 text-gray-700' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          aria-label={calculatorOpen ? "Close calculator" : "Open calculator"}
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
      )}
    </header>
  );
} 