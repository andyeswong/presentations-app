import React, { useState } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  UserGroupIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Presentation {
  id: number;
  title: string;
  slides: any[];
  uid: string;
}

interface Participant {
  id: number;
  name: string;
  current_slide: number;
  last_activity: string;
}

interface PresenterControlsProps {
  presentation: Presentation;
  currentSlideIndex: number;
  totalSlides: number;
  participants: Participant[];
  previousSlide: () => void;
  nextSlide: () => void;
  goToSlide: (index: number) => void;
}

export default function PresenterControls({
  presentation,
  currentSlideIndex,
  totalSlides,
  participants,
  previousSlide,
  nextSlide,
  goToSlide,
}: PresenterControlsProps) {
  const [minimized, setMinimized] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Start/stop timer
  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isTimerRunning) {
      intervalId = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTimerRunning]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setElapsedTime(0);
    setIsTimerRunning(false);
  };

  const toggleMinimized = () => {
    setMinimized(!minimized);
  };

  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
  };

  return (
    <div 
      className={`fixed ${minimized ? 'bottom-4 left-4' : 'left-0 top-0 bottom-0'} z-50 transition-all duration-300`}
      style={{ width: minimized ? 'auto' : '300px' }}
    >
      {minimized ? (
        <button
          onClick={toggleMinimized}
          className="bg-gray-900/80 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:bg-gray-800"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      ) : (
        <div className="h-full bg-gray-900/80 backdrop-blur-md text-white border-r border-gray-700">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Presenter Controls</h2>
            <button
              onClick={toggleMinimized}
              className="text-gray-400 hover:text-white"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4">
            <div className="mb-6">
              <div className="text-sm text-gray-400 mb-1">Current Slide</div>
              <div className="text-xl font-bold">{currentSlideIndex + 1} / {totalSlides}</div>
            </div>
            
            <div className="flex space-x-2 mb-6">
              <button
                onClick={previousSlide}
                disabled={currentSlideIndex === 0}
                className={`flex-1 py-2 px-4 rounded ${
                  currentSlideIndex === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                Previous
              </button>
              
              <button
                onClick={nextSlide}
                disabled={currentSlideIndex === totalSlides - 1}
                className={`flex-1 py-2 px-4 rounded ${
                  currentSlideIndex === totalSlides - 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                Next
              </button>
            </div>
            
            <div className="mb-6">
              <div className="text-sm text-gray-400 mb-2">Go to Slide</div>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`p-2 rounded text-sm ${
                      currentSlideIndex === index
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-sm text-gray-400 mb-2">Timer</div>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-800 py-1 px-3 rounded text-xl font-mono">
                  {formatTime(elapsedTime)}
                </div>
                <button
                  onClick={toggleTimer}
                  className={`p-1 rounded ${
                    isTimerRunning ? 'bg-red-600' : 'bg-green-600'
                  }`}
                >
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-1 rounded bg-gray-700"
                >
                  Reset
                </button>
              </div>
            </div>
            
            <div>
              <button
                onClick={toggleParticipants}
                className="flex items-center space-x-2 py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded w-full"
              >
                <UserGroupIcon className="h-4 w-4" />
                <span>Participants ({participants.length})</span>
              </button>
              
              {showParticipants && (
                <div className="mt-2 bg-gray-800 rounded p-2 max-h-40 overflow-y-auto">
                  {participants.length === 0 ? (
                    <div className="text-sm text-gray-400 py-2 text-center">
                      No active participants
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {participants.map((participant) => (
                        <li 
                          key={participant.id}
                          className="text-sm flex justify-between py-1 px-2 hover:bg-gray-700 rounded"
                        >
                          <span>{participant.name}</span>
                          <span className="text-gray-400">
                            Slide {participant.current_slide + 1}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 