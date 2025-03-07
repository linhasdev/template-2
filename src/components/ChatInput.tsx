import React, { FormEvent, ChangeEvent, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function ChatInput({ 
  input, 
  handleInputChange, 
  handleSubmit, 
  isLoading 
}: ChatInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        const form = e.currentTarget.closest('form');
        if (form) form.requestSubmit();
      }
    }
  };

  React.useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto w-full">
      <div className="flex gap-2 items-stretch w-full">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="flex-1 p-3 rounded-xl border border-gray-300 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 outline-none resize-none shadow-sm min-h-[50px] max-h-[200px] text-gray-700 placeholder-gray-400"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex items-center justify-center px-4 rounded-xl bg-gray-800 text-white hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={24} />
        </button>
      </div>
    </form>
  );
} 