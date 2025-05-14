import React from 'react';

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

interface SlidePreviewCardProps {
  slide: Slide;
  theme: string;
}

export default function SlidePreviewCard({ slide, theme }: SlidePreviewCardProps) {
  // Function to get background class based on theme
  const getBackgroundClass = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900';
      case 'light':
        return 'bg-white';
      case 'gradient':
        return 'bg-gradient-to-br from-slate-900 to-amber-900';
      default:
        return 'bg-gradient-to-br from-slate-900 to-amber-900';
    }
  };

  const getTextColorClass = () => {
    switch (theme) {
      case 'light':
        return 'text-gray-900';
      default:
        return 'text-white';
    }
  };

  // Function to get contrast color for elements based on theme
  const getContrastColor = () => {
    switch (theme) {
      case 'light':
        return 'bg-amber-500/20 border-amber-600/30';
      case 'dark':
        return 'bg-amber-500/30 border-amber-400/30';
      default:
        return 'bg-amber-500/20 border-amber-400/30';
    }
  };

  // Simplified slide rendering based on slide type
  const renderSlideContent = () => {
    const contrastClass = getContrastColor();
    
    switch (slide.type) {
      case 'title':
        return (
          <div className="flex flex-col items-center justify-center text-center p-4 h-full">
            {slide.content?.title && (
              <h2 className="text-lg font-bold truncate max-w-full border-b-2 border-current pb-1">
                {slide.content.title}
              </h2>
            )}
            {slide.content?.subtitle && (
              <p className="text-xs mt-2 truncate max-w-full opacity-80">
                {slide.content.subtitle}
              </p>
            )}
          </div>
        );
      
      case 'content':
        return (
          <div className="p-4 h-full">
            {slide.content?.heading && (
              <h3 className="text-sm font-bold truncate max-w-full border-b border-current pb-1 mb-2">
                {slide.content.heading}
              </h3>
            )}
            {slide.content?.body && (
              <div className={`text-xs p-2 rounded ${contrastClass} border`}>
                <p className="line-clamp-2">
                  {slide.content.body.split('\n')[0]}
                </p>
              </div>
            )}
          </div>
        );
      
      case 'scroll':
        return (
          <div className="p-4 h-full">
            {slide.content?.containerTitle && (
              <h3 className="text-sm font-bold truncate max-w-full border-b border-current pb-1 mb-2">
                {slide.content.containerTitle}
              </h3>
            )}
            <div className={`mt-2 p-2 rounded-lg ${contrastClass} border flex items-center justify-center`}>
              <div className="flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-current"></div>
                <div className="h-3 w-3 rounded-full bg-current opacity-80"></div>
                <div className="h-3 w-3 rounded-full bg-current opacity-60"></div>
              </div>
            </div>
          </div>
        );
      
      case 'comparison':
        return (
          <div className="p-4 h-full">
            {slide.content?.tableTitle && (
              <h3 className="text-sm font-bold truncate max-w-full border-b border-current pb-1 mb-2">
                {slide.content.tableTitle}
              </h3>
            )}
            <div className={`mt-2 p-2 rounded-lg ${contrastClass} border`}>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-3 bg-current rounded"></div>
                <div className="h-3 bg-current opacity-80 rounded"></div>
                <div className="h-3 bg-current opacity-80 rounded"></div>
                <div className="h-3 bg-current opacity-60 rounded"></div>
              </div>
            </div>
          </div>
        );
      
      case 'diagram':
        return (
          <div className="p-4 h-full">
            {slide.content?.diagramTitle && (
              <h3 className="text-sm font-bold truncate max-w-full border-b border-current pb-1 mb-2">
                {slide.content.diagramTitle}
              </h3>
            )}
            <div className={`mt-2 p-2 rounded-lg ${contrastClass} border flex items-center justify-center`}>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-current"></div>
                <div className="w-6 h-1 bg-current"></div>
                <div className="h-4 w-4 rounded-full bg-current opacity-80"></div>
                <div className="w-6 h-1 bg-current"></div>
                <div className="h-4 w-4 rounded-full bg-current opacity-60"></div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center p-4 h-full">
            <span className={`text-xs p-2 rounded ${contrastClass} border`}>Preview not available</span>
          </div>
        );
    }
  };

  return (
    <div className={`w-full h-full overflow-hidden ${getBackgroundClass()} ${getTextColorClass()}`}>
      {renderSlideContent()}
    </div>
  );
} 