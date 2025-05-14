import React, { useState, useEffect } from 'react';
import TitleSlide from '../SlideTemplates/TitleSlide';
import ContentSlide from '../SlideTemplates/ContentSlide';
import ScrollContainerSlide from '../SlideTemplates/ScrollContainerSlide';
import ComparisonTableSlide from '../SlideTemplates/ComparisonTableSlide';
import DiagramSlide from '../SlideTemplates/DiagramSlide';

interface Slide {
  id: number;
  title: string | null;
  content: any;
  type: string;
  order: number;
  template: string;
  settings: any;
  presentation_id: number;
  created_at: string;
  updated_at: string;
}

interface SlidePreviewProps {
  slide: Slide;
  theme: string;
}

export default function SlidePreview({ slide, theme }: SlidePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Add keyboard listener for Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const renderSlide = () => {
    switch (slide.type) {
      case 'title':
        return <TitleSlide content={slide.content} theme={theme} />;
      case 'content':
        return <ContentSlide content={slide.content} theme={theme} />;
      case 'scroll':
        return <ScrollContainerSlide content={slide.content} theme={theme} />;
      case 'comparison':
        return <ComparisonTableSlide content={slide.content} theme={theme} />;
      case 'diagram':
        return <DiagramSlide content={slide.content} theme={theme} />;
      default:
        return (
          <div className="flex items-center justify-center w-full h-full bg-gray-900 text-white">
            <div className="text-center">
              <h2 className="text-xl">Unknown slide type</h2>
            </div>
          </div>
        );
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Fullscreen overlay component
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="flex justify-between items-center p-4 bg-gray-800">
          <h3 className="text-lg font-medium text-white">Slide Preview - Fullscreen</h3>
          <div className="flex items-center">
            <span className="text-gray-300 text-sm mr-4">Press ESC to exit</span>

          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full h-full max-w-screen-xl mx-auto" style={{ aspectRatio: '16/9' }}>
            {renderSlide()}
          </div>
        </div>
      </div>
    );
  }

  // Regular preview with 16:9 aspect ratio
  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Live Preview</h3>
        <button 
          onClick={toggleFullscreen}
          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-md shadow-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
          Fullscreen
        </button>
      </div>
      
      {/* 16:9 aspect ratio container */}
      <div className="relative" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0 overflow-hidden rounded-lg shadow-inner border border-gray-300 dark:border-gray-600">
          {/* Scale slide to fit in the container */}
          <div className="w-full h-full transform scale-100 origin-top-left">
            {renderSlide()}
          </div>
        </div>
      </div>
    </div>
  );
} 