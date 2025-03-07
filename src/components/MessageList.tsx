import { Message } from 'ai';
import { useState, useEffect } from 'react';
import { Check, Copy, User, Bot } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const processMessage = (content: string) => {
    // Split content into paragraphs
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, pIndex) => {
      // Process each paragraph for LaTeX content using a more compatible regex
      const parts = paragraph.split(/(?:\\[\[\(][\s\S]*?\\[\]\)])/g);
      const matches = paragraph.match(/(?:\\[\[\(][\s\S]*?\\[\]\)])/g) || [];
      
      // Interleave the parts with the matches
      const processedParts = parts.reduce((acc: JSX.Element[], part, index) => {
        acc.push(<span key={`${pIndex}-${index}-text`}>{part}</span>);
        
        if (index < matches.length) {
          const match = matches[index];
          const isDisplayMath = match.startsWith('\\[') && match.endsWith('\\]');
          const isInlineMath = match.startsWith('\\(') && match.endsWith('\\)');
          
          if (isDisplayMath || isInlineMath) {
            try {
              // Remove the delimiters
              const latex = match.slice(2, -2);
              const html = katex.renderToString(latex, {
                displayMode: isDisplayMath,
                throwOnError: false,
                strict: false
              });
              
              acc.push(
                <span 
                  key={`${pIndex}-${index}-math`}
                  className={isDisplayMath ? 'math-block' : 'katex-inline'}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            } catch (error) {
              console.error('LaTeX rendering error:', error);
              acc.push(<span key={`${pIndex}-${index}-error`}>{match}</span>);
            }
          }
        }
        
        return acc;
      }, []);
      
      // Wrap each paragraph in a p tag
      return <p key={`p-${pIndex}`} className="message-content">{processedParts}</p>;
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex items-start space-x-4 ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div 
            className={`flex-none w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
            }`}
          >
            {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
          </div>
          
          <div className="relative max-w-[80%] group">
            <div 
              className={`p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              {processMessage(message.content)}
            </div>
            
            {message.role === 'assistant' && (
              <button
                onClick={() => copyToClipboard(message.content, message.id)}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-white/50 backdrop-blur-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Copy message"
              >
                {copiedId === message.id ? <Check size={16} /> : <Copy size={16} />}
              </button>
            )}
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex items-start space-x-4">
          <div className="flex-none w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <Bot size={16} />
          </div>
          <div className="bg-white border border-gray-200 p-3 rounded-lg">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}