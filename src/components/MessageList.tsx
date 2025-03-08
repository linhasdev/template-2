import { Message } from 'ai';
import { useState, useEffect, useMemo } from 'react';
import { Check, Copy, User, Bot } from 'lucide-react';
import katex from 'katex';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

// Configure marked options outside the component
marked.setOptions({
  gfm: true,
  breaks: true,
  pedantic: false
});

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderLatex = (content: string): string => {
    // First, handle block math (both $$ and \[ \] syntax)
    content = content.replace(/\$\$(.*?)\$\$/gs, (_, equation) => {
      try {
        return katex.renderToString(equation.trim(), {
          displayMode: true,
          throwOnError: false,
          strict: false
        });
      } catch (error) {
        console.error('LaTeX rendering error:', error);
        return `$$${equation}$$`;
      }
    });

    content = content.replace(/\\\[(.*?)\\\]/gs, (_, equation) => {
      try {
        return katex.renderToString(equation.trim(), {
          displayMode: true,
          throwOnError: false,
          strict: false
        });
      } catch (error) {
        console.error('LaTeX rendering error:', error);
        return `\\[${equation}\\]`;
      }
    });

    // Then handle inline math (both $ and \( \) syntax)
    content = content.replace(/\$(.+?)\$/g, (_, equation) => {
      try {
        return katex.renderToString(equation.trim(), {
          displayMode: false,
          throwOnError: false,
          strict: false
        });
      } catch (error) {
        console.error('LaTeX rendering error:', error);
        return `$${equation}$`;
      }
    });

    content = content.replace(/\\\((.*?)\\\)/g, (_, equation) => {
      try {
        return katex.renderToString(equation.trim(), {
          displayMode: false,
          throwOnError: false,
          strict: false
        });
      } catch (error) {
        console.error('LaTeX rendering error:', error);
        return `\\(${equation}\\)`;
      }
    });

    return content;
  };

  const processMessage = (content: string) => {
    // First, process LaTeX
    const processedLatex = renderLatex(content);
    
    // Then process Markdown and sanitize the output
    const html = marked.parse(processedLatex) as string;
    const processedMarkdown = DOMPurify.sanitize(html);

    return (
      <div 
        className="prose prose-slate max-w-none
          prose-headings:text-gray-900 prose-p:text-gray-800 
          prose-strong:text-gray-900 prose-em:text-gray-800
          prose-code:text-gray-800 prose-li:text-gray-800
          prose-p:mt-2 prose-p:mb-2
          prose-headings:mt-4 prose-headings:mb-2
          prose-li:mt-1 prose-li:mb-1
          prose-code:px-1 prose-code:py-0.5 prose-code:bg-gray-100 prose-code:rounded
          prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
          prose-table:border prose-table:border-collapse prose-td:border prose-td:p-2 prose-th:border prose-th:p-2
          [&_.katex-display]:my-4 [&_.katex]:leading-normal"
        dangerouslySetInnerHTML={{ __html: processedMarkdown }}
      />
    );
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
                  ? 'bg-blue-500 prose-headings:text-white prose-p:text-white prose-strong:text-white prose-em:text-white prose-code:text-white prose-code:bg-blue-600 prose-pre:bg-blue-600 prose-blockquote:border-white prose-a:text-white prose-li:text-white' 
                  : 'bg-white border border-gray-200'
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