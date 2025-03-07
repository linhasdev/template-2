"use client";

import React, { useState, useRef, FormEvent, useEffect } from 'react';
import { Maximize, Minimize, X, GripHorizontal, Send, Search, Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw } from 'lucide-react';
import Draggable from 'react-draggable';
import { useChatbot } from '@/lib/contexts/ChatbotContext';

interface FloatingVideoProps {
  videoSrc: string;
  title: string;
  onClose: () => void;
  isSidebarExpanded?: boolean;
  onAskQuestion?: (question: string) => void;
}

export default function FloatingVideo({ videoSrc, title, onClose, isSidebarExpanded = false, onAskQuestion }: FloatingVideoProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showReplay, setShowReplay] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [question, setQuestion] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { askQuestion, messages } = useChatbot();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreenVideoReady, setIsFullscreenVideoReady] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [timecode, setTimecode] = useState('00:00');
  
  // Sample video URL - replace with your actual video URL
  // For demo purposes, using a sample MP4 video
  const videoUrl = "https://storage.googleapis.com/test2324234242/diffequations.mp4";
  
  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Add event listeners to update play state
  useEffect(() => {
    const normalVideo = videoRef.current;
    const fullscreenVideo = fullscreenVideoRef.current;
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    if (normalVideo) {
      normalVideo.addEventListener('play', handlePlay);
      normalVideo.addEventListener('pause', handlePause);
    }
    
    if (fullscreenVideo) {
      fullscreenVideo.addEventListener('play', handlePlay);
      fullscreenVideo.addEventListener('pause', handlePause);
    }
    
    return () => {
      if (normalVideo) {
        normalVideo.removeEventListener('play', handlePlay);
        normalVideo.removeEventListener('pause', handlePause);
      }
      
      if (fullscreenVideo) {
        fullscreenVideo.removeEventListener('play', handlePlay);
        fullscreenVideo.removeEventListener('pause', handlePause);
      }
    };
  }, []);
  
  // Sync video playback state between normal and fullscreen modes
  useEffect(() => {
    const normalVideo = videoRef.current;
    const fullscreenVideo = fullscreenVideoRef.current;
    
    if (isFullscreen && normalVideo && fullscreenVideo) {
      // When entering fullscreen, sync the state from normal video to fullscreen video
      const currentTime = normalVideo.currentTime;
      const isPaused = normalVideo.paused;
      const isMuted = normalVideo.muted;
      
      // Set properties on the fullscreen video
      fullscreenVideo.muted = isMuted;
      
      // Use a small timeout to ensure the video element is ready
      setTimeout(() => {
        if (fullscreenVideo) {
          fullscreenVideo.currentTime = currentTime;
          if (isPaused) {
            fullscreenVideo.pause();
            setIsPlaying(false);
          } else {
            fullscreenVideo.play().catch(e => console.error('Error playing video:', e));
            setIsPlaying(true);
          }
        }
      }, 50); // Reduced timeout for faster transition
    } else if (!isFullscreen && normalVideo && fullscreenVideo) {
      // When exiting fullscreen, sync the state from fullscreen video to normal video
      const currentTime = fullscreenVideo.currentTime;
      const isPaused = fullscreenVideo.paused;
      const isMuted = fullscreenVideo.muted;
      
      // Set properties on the normal video
      normalVideo.muted = isMuted;
      
      // Use a small timeout to ensure the video element is ready
      setTimeout(() => {
        if (normalVideo) {
          normalVideo.currentTime = currentTime;
          if (isPaused) {
            normalVideo.pause();
            setIsPlaying(false);
          } else {
            normalVideo.play().catch(e => console.error('Error playing video:', e));
            setIsPlaying(true);
          }
        }
      }, 50); // Reduced timeout for faster transition
    }
  }, [isFullscreen]);
  
  // Toggle play/pause
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = isFullscreen ? fullscreenVideoRef.current : videoRef.current;
    
    if (video) {
      if (!video.paused) {
        video.pause();
        setIsPlaying(false);
      } else {
        video.play().catch(e => console.error('Error playing video:', e));
        setIsPlaying(true);
      }
    }
  };
  
  // Toggle mute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = isFullscreen ? fullscreenVideoRef.current : videoRef.current;
    
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Modify fullscreen toggle to include animations
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isFullscreen) {
      // Start closing animation
      setIsClosing(true);
      
      // Save current time before toggling
      if (fullscreenVideoRef.current) {
        const time = fullscreenVideoRef.current.currentTime;
        setCurrentTime(time);
      }
      
      // Wait for animation to complete
      setTimeout(() => {
        setIsFullscreen(false);
        setIsClosing(false);
        document.body.style.overflow = 'auto';
        setIsChatExpanded(false);
        setShowMessages(false);
      }, 300);
    } else {
      // Save current time before entering fullscreen
      if (videoRef.current) {
        const time = videoRef.current.currentTime;
        setCurrentTime(time);
      }
      
      setIsFullscreen(true);
      document.body.style.overflow = 'hidden';
    }
  };
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Draggable configuration
  const dragHandlers = {
    onStart: (e: any) => {
      if (isFullscreen) {
        e.preventDefault();
      }
    },
    cancel: '.button, video',
    bounds: "parent",
    defaultPosition: { x: 20, y: 20 },
    position: undefined
  };
  
  // Handle chat expansion
  const toggleChatExpansion = () => {
    setIsChatExpanded(!isChatExpanded);
    
    // Focus the input after expansion
    if (!isChatExpanded) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Wait for animation to complete
    }
  };
  
  // Handle question submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      // Use the shared askQuestion method from context
      await askQuestion(question);
      
      // Reset local state
      setQuestion('');
      setIsChatExpanded(false);
      
      // Show messages panel after asking
      setShowMessages(true);
    }
  };
  
  // Add seek functions
  const seekVideo = (e: React.MouseEvent, seconds: number) => {
    e.stopPropagation();
    const video = isFullscreen ? fullscreenVideoRef.current : videoRef.current;
    
    if (video) {
      const newTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
      video.currentTime = newTime;
      setCurrentTime(newTime); // Update the currentTime state
    }
  };
  
  // Add progress update handler
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const progress = (video.currentTime / video.duration) * 100;
    setProgress(progress);
    setTimecode(formatTime(video.currentTime));
    setCurrentTime(video.currentTime); // Keep currentTime state in sync
  };
  
  // Add video ended handler
  const handleVideoEnded = () => {
    setShowReplay(true);
    setIsPlaying(false);
  };

  // Add replay function
  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = isFullscreen ? fullscreenVideoRef.current : videoRef.current;
    
    if (video) {
      video.currentTime = 0;
      video.play().catch(e => console.error('Error playing video:', e));
      setShowReplay(false);
      setIsPlaying(true);
    }
  };
  
  // Modify chat expansion handler
  const handleAskQuestion = () => {
    if (isFullscreen) {
      setIsChatExpanded(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };
  
  // Handle question submission in fullscreen
  const handleFullscreenSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      const currentQuestion = question; // Store current question
      
      // Start closing animations
      setIsChatExpanded(false);
      setIsClosing(true);
      
      // Send the question through the callback immediately
      if (onAskQuestion) {
        onAskQuestion(currentQuestion);
      }
      
      // Wait for animations to complete before closing fullscreen
      setTimeout(() => {
        setIsFullscreen(false);
        setIsClosing(false);
        document.body.style.overflow = 'auto';
        setQuestion(''); // Clear the question after animation
      }, 300);
    }
  };
  
  // Update fullscreen render return with animation classes
  if (isFullscreen) {
    return (
      <div 
        className={`
          fixed bg-gray-900 z-50 pointer-events-auto
          transition-all duration-300 p-8
          ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
          ${isSidebarExpanded ? 'left-40' : 'left-12'} right-0 top-0 bottom-0
        `}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div className="w-full h-full flex items-center justify-center bg-gray-100 p-1 rounded-lg overflow-hidden shadow-2xl">
          <div className="relative w-full h-full flex items-center justify-center bg-black rounded-md overflow-hidden">
            {/* Maintain 16:9 aspect ratio */}
            <div className="w-full h-0 pb-[56.25%] relative">
              <video
                ref={fullscreenVideoRef}
                src={videoUrl}
                className="absolute inset-0 w-full h-full object-contain"
                autoPlay
                playsInline
                onClick={togglePlay}
                preload="auto"
                onLoadedData={(e) => {
                  // Set the current time when the video is loaded
                  if (fullscreenVideoRef.current) {
                    fullscreenVideoRef.current.currentTime = currentTime;
                    setIsFullscreenVideoReady(true);
                    
                    // Make sure play state is synced
                    if (isPlaying) {
                      fullscreenVideoRef.current.play().catch(e => console.error('Error playing video:', e));
                    } else {
                      fullscreenVideoRef.current.pause();
                    }
                  }
                }}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
              />
            </div>
          </div>
        </div>
        
        {/* Fullscreen controls */}
        <div 
          className={`
            absolute top-8 left-8 right-8 h-12
            bg-gradient-to-b from-black/70 to-transparent 
            z-10 flex items-center justify-end px-4 rounded-t-lg
            transition-opacity duration-200
            ${showControls ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button 
                onClick={() => setShowMessages(!showMessages)}
                className="button p-2 bg-white/90 text-blue-600 rounded-full hover:bg-white transition-all duration-200 shadow-md"
                aria-label={showMessages ? "Hide chat" : "Show chat"}
              >
                <span className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                  </svg>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-medium">
                    {messages.length}
                  </span>
                </span>
              </button>
            )}
            <button 
              onClick={toggleFullscreen}
              className="button p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-all duration-200 scale-110"
              aria-label="Exit fullscreen"
            >
              <Minimize size={24} />
            </button>
          </div>
        </div>
        
        {/* Video controls overlay */}
        <div 
          className={`
            absolute bottom-8 left-8 right-8 h-16
            bg-gradient-to-t from-black/70 to-transparent 
            z-10 flex items-center justify-between px-4 rounded-b-lg
            transition-opacity duration-200
            ${showControls ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => seekVideo(e, -10)}
              className="button p-1.5 text-white hover:text-gray-200 transition-colors"
              aria-label="Rewind 10 seconds"
            >
              <RotateCcw size={20} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="button p-1.5 text-white hover:text-gray-200 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button 
              onClick={(e) => seekVideo(e, 10)}
              className="button p-1.5 text-white hover:text-gray-200 transition-colors"
              aria-label="Forward 10 seconds"
            >
              <RotateCw size={20} />
            </button>

            <span className="text-white/70 text-sm font-medium ml-2">{timecode}</span>
          </div>
          
          <button 
            onClick={toggleMute}
            className="button p-2 text-white hover:text-gray-200 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-600/30">
          <div 
            className="h-full bg-gray-400 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Replay button overlay */}
        {showReplay && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/50 z-20"
            onClick={handleReplay}
          >
            <button
              className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Replay video"
            >
              <RotateCcw size={32} className="text-white" />
            </button>
          </div>
        )}
        
        {/* Chat interface in fullscreen mode - Google-style */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 w-auto">
          <div 
            className={`
              relative flex items-center
              transition-all duration-300 ease-in-out
              ${isChatExpanded ? 'w-[600px]' : 'w-auto'}
              overflow-hidden
            `}
          >
            {isChatExpanded ? (
              <form onSubmit={handleFullscreenSubmit} className="w-full">
                <div className="flex w-full bg-white rounded-full shadow-lg border border-gray-200 px-5 py-3">
                  <Search className="text-gray-400 mr-3" size={20} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about this video..."
                    className="w-full bg-transparent text-gray-800 border-none outline-none font-normal"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                    aria-label="Send question"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={handleAskQuestion}
                className="px-6 py-3 bg-white text-gray-700 font-normal rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 flex items-center gap-2"
              >
                <Search size={18} className="text-gray-500" />
                <span>Ask a question</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Render floating video (non-fullscreen)
  return (
    <div className="fixed inset-0 pointer-events-none z-[55]">
      <div className="relative w-full h-full">
        <Draggable
          nodeRef={nodeRef}
          handle=".handle"
          {...dragHandlers}
        >
          <div
            ref={nodeRef}
            className="absolute pointer-events-auto bg-black rounded-lg shadow-xl overflow-hidden w-[400px] aspect-video"
            style={{ top: '20px', left: '80px' }}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            {/* Video container */}
            <div className="w-full h-full">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain"
                autoPlay
                playsInline
                onClick={togglePlay}
                preload="auto"
                onLoadedData={(e) => {
                  // Set the current time when the video is loaded
                  if (videoRef.current && currentTime > 0) {
                    videoRef.current.currentTime = currentTime;
                    
                    // Make sure play state is synced
                    if (isPlaying) {
                      videoRef.current.play().catch(e => console.error('Error playing video:', e));
                    } else {
                      videoRef.current.pause();
                    }
                  }
                }}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
              />
            </div>
            
            {/* Control bar */}
            <div 
              className={`
                handle absolute top-0 left-0 right-0 h-12
                bg-gradient-to-b from-black/70 to-transparent 
                z-10 flex items-center justify-between px-4
                transition-opacity duration-200 cursor-move
                ${showControls ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <div className="flex items-center">
                <GripHorizontal size={16} className="text-white/70" />
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={toggleFullscreen}
                  className="button p-2 bg-black/50 text-white rounded-full hover:bg-black/90 transition-all duration-200"
                  aria-label="Enter fullscreen"
                >
                  <Maximize size={20} />
                </button>
                <button 
                  onClick={onClose}
                  className="button p-2 bg-black/50 text-white rounded-full hover:bg-black/90 transition-colors"
                  aria-label="Close video"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Video controls overlay */}
            <div 
              className={`
                absolute bottom-0 left-0 right-0 h-16
                bg-gradient-to-t from-black/70 to-transparent 
                z-10 flex items-center justify-between px-4
                transition-opacity duration-200
                ${showControls ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => seekVideo(e, -10)}
                  className="button p-1.5 text-white hover:text-gray-200 transition-colors"
                  aria-label="Rewind 10 seconds"
                >
                  <RotateCcw size={20} />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="button p-1.5 text-white hover:text-gray-200 transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                
                <button 
                  onClick={(e) => seekVideo(e, 10)}
                  className="button p-1.5 text-white hover:text-gray-200 transition-colors"
                  aria-label="Forward 10 seconds"
                >
                  <RotateCw size={20} />
                </button>

                <span className="text-white/70 text-sm font-medium ml-2">{timecode}</span>
              </div>
              
              <button 
                onClick={toggleMute}
                className="button p-2 text-white hover:text-gray-200 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-600/30">
              <div 
                className="h-full bg-gray-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Replay button overlay */}
            {showReplay && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/50 z-20"
                onClick={handleReplay}
              >
                <button
                  className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  aria-label="Replay video"
                >
                  <RotateCcw size={32} className="text-white" />
                </button>
              </div>
            )}
          </div>
        </Draggable>
      </div>
    </div>
  );
}