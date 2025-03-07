import { useState } from 'react';

interface EmptyStateProps {
  onShowVideo?: () => void;
}

export default function EmptyState({ onShowVideo }: EmptyStateProps = {}) {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto text-center">
      <div className="mb-1">
        <h1 className="text-4xl font-serif text-gray-800 mb-1.5 tracking-tight">How can I help with Differential Equations?</h1>
        <p className="text-gray-400 text-xs tracking-wide font-light">choose what you&apos;d like me to help you with</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-xl mx-auto">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-gray-100 rounded-md shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 text-sm mb-0.5"><span className="text-blue-500">@Solve</span> an equation for me</h3>
              <p className="text-gray-500 text-xs leading-snug">Get step-by-step solutions to differential equations with detailed explanations.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-gray-100 rounded-md shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4v16a1 1 0 001 1h14a1 1 0 001-1V4" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 text-sm mb-0.5"><span className="text-blue-500">@Graph</span> a function for me</h3>
              <p className="text-gray-500 text-xs leading-snug">Visualize solutions to differential equations in the interactive calculator.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-gray-100 rounded-md shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 text-sm mb-0.5">Explain the lecture</h3>
              <p className="text-gray-500 text-xs leading-snug">Get clear explanations of complex concepts from the professor&apos;s lecture.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-gray-100 rounded-md shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 text-sm mb-0.5">Show me a formula</h3>
              <p className="text-gray-500 text-xs leading-snug">Access common differential equation formulas and theorems with examples.</p>
            </div>
          </div>
        </div>
      </div>
      
      {onShowVideo && (
        <button
          onClick={onShowVideo}
          className="mt-6 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors flex items-center gap-1.5 shadow-sm text-xs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Start Today&apos;s Lecture
        </button>
      )}
    </div>
  );
} 