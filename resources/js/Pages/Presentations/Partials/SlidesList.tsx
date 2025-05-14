import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

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

interface SlidesListProps {
  slides: Slide[];
  selectedSlide: Slide | null;
  onSelectSlide: (slide: Slide) => void;
  onDeleteSlide: (slideId: number) => void;
  onReorderSlides: (slides: Slide[]) => void;
}

export default function SlidesList({
  slides,
  selectedSlide,
  onSelectSlide,
  onDeleteSlide,
  onReorderSlides,
}: SlidesListProps) {
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('slideIndex', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('slideIndex'));
    if (draggedIndex === index) return;

    const newSlides = [...slides];
    const draggedSlide = newSlides[draggedIndex];
    
    // Remove the dragged item
    newSlides.splice(draggedIndex, 1);
    // Insert it at the new position
    newSlides.splice(index, 0, draggedSlide);
    
    // Update the order property
    const reorderedSlides = newSlides.map((slide, idx) => ({
      ...slide,
      order: idx
    }));
    
    onReorderSlides(reorderedSlides);
  };

  const getSlideTypeIcon = (type: string) => {
    switch (type) {
      case 'title':
        return 'T';
      case 'content':
        return 'C';
      case 'scroll':
        return 'S';
      case 'comparison':
        return 'CM';
      case 'diagram':
        return 'D';
      default:
        return '#';
    }
  };

  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      {slides.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No slides yet. Add your first slide using the button above.
        </div>
      ) : (
        slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`flex items-center p-2 rounded-md cursor-pointer ${
              selectedSlide?.id === slide.id
                ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700'
                : 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 border border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => onSelectSlide(slide)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center mr-3 text-xs font-medium text-gray-700 dark:text-gray-200">
              {getSlideTypeIcon(slide.type)}
            </div>
            <div className="flex-grow min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                {slide.title || `Slide ${index + 1}`}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {slide.type} template
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this slide?')) {
                  onDeleteSlide(slide.id);
                }
              }}
              className="ml-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))
      )}
    </div>
  );
} 