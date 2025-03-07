"use client";

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface DesmosCalculatorProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function DesmosCalculator({ isOpen, onToggle }: DesmosCalculatorProps) {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [calculator, setCalculator] = useState<any>(null);

  // Initialize calculator when script is loaded and container is ready
  useEffect(() => {
    if (!isLoaded || !calculatorRef.current || !isOpen) return;

    // Small delay to ensure the container is fully visible
    const initTimer = setTimeout(() => {
      if (!calculator) {
        try {
          const calc = window.Desmos.GraphingCalculator(calculatorRef.current!, {
            expressions: true,
            settingsMenu: true,
            zoomButtons: true,
            expressionsTopbar: true,
            border: false,
            lockViewport: false,
            expressionsCollapsed: false,
            backgroundColor: "#FFFFFF",
          });
          
          // Resize after initialization to ensure proper rendering
          calc.resize();
          setCalculator(calc);
        } catch (error) {
          console.error('Error initializing Desmos calculator:', error);
        }
      } else {
        // If calculator exists but was hidden, resize it
        calculator.resize();
      }
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (!isOpen && calculator) {
        calculator.destroy();
        setCalculator(null);
      }
    };
  }, [isLoaded, isOpen, calculator]);

  return (
    <>
      <Script
        src="https://www.desmos.com/api/v1.8/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"
        onLoad={() => setIsLoaded(true)}
        strategy="afterInteractive"
      />

      <div 
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-40 ${
          isOpen ? 'w-[400px]' : 'w-0 overflow-hidden'
        }`}
      >
        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="absolute top-1/2 -left-8 transform -translate-y-1/2 bg-gray-50 hover:bg-gray-100 text-gray-600 p-1.5 rounded-l-md shadow-sm border border-gray-200 border-r-0 z-40"
          aria-label={isOpen ? "Close calculator" : "Open calculator"}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>

        {/* Calculator content */}
        <div className={`h-full flex flex-col ${!isOpen ? 'hidden' : ''}`}>
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-700">Graphing Calculator</h2>
            <button 
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close calculator"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div 
            ref={calculatorRef} 
            className="flex-1 w-full"
            style={{ 
              minHeight: "400px",
              height: "calc(100vh - 48px)" // Adjusted for smaller header
            }}
          />
        </div>
      </div>
    </>
  );
} 