import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
// Import Pusher
import Pusher from 'pusher-js';
import TitleSlide from './SlideTemplates/TitleSlide';
import ContentSlide from './SlideTemplates/ContentSlide';
import ScrollContainerSlide from './SlideTemplates/ScrollContainerSlide';
import ComparisonTableSlide from './SlideTemplates/ComparisonTableSlide';
import DiagramSlide from './SlideTemplates/DiagramSlide';
import PresenterControls from './Partials/PresenterControls';

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

interface Presentation {
  id: number;
  title: string;
  description: string | null;
  slug: string;
  uid: string;
  theme: string;
  is_public: boolean;
  presenter_password: string;
  created_at: string;
  updated_at: string;
  slides: Slide[];
}

interface PageProps {
  presentation: Presentation;
  isPresenter: boolean;
}

export default function Present({ presentation, isPresenter }: PageProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [participants, setParticipants] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [channel, setChannel] = useState<any | null>(null);
  const [showControls, setShowControls] = useState(true);

  // Register as a participant
  useEffect(() => {
    const registerParticipant = async () => {
      try {
        const response = await axios.post(route('participant.register', presentation.uid), {
          name: 'Anonymous Viewer',
        });
        
        setSessionId(response.data.sessionId);
        
        // Clean up on unmount
        return () => {
          if (sessionId) {
            axios.post(route('participant.disconnect'), {
              session_id: sessionId,
            }).catch(console.error);
          }
        };
      } catch (error) {
        console.error('Error registering as participant:', error);
      }
    };

    registerParticipant();
  }, [presentation.uid]);

  // Set up Pusher
  useEffect(() => {
    try {
      // Initialize Pusher
      const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
      const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;
      
      // Check if we have valid Pusher credentials
      if (!pusherKey || pusherKey === 'your-pusher-key' || pusherKey === '') {
        console.warn('Pusher is not configured. Real-time updates will not work, but basic presentation functionality will still work.');
        
        // Create mock channel for fallback functionality
        setChannel({
          // Mock methods to prevent errors
          bind: () => {},
          unbind_all: () => {},
          trigger: () => {
            console.warn('Real-time messaging disabled: Pusher not configured');
            return false;
          }
        });
        
        return;
      }
      
      const pusherInstance = new Pusher(pusherKey, {
        cluster: pusherCluster || 'us3',
        forceTLS: true,
      });
      
      setPusher(pusherInstance);
      
      // For presenters, subscribe to private presenter channel
      // For audience, subscribe to public presentation channel
      if (isPresenter) {
        // Presenter subscribes to their private channel
        const presenterChannel = pusherInstance.subscribe(`private-presenter-${presentation.id}`);
        setChannel(presenterChannel);
        
        // Echo the slide changes to the public channel
        // This is handled server-side automatically
      } else {
        // Audience subscribes to the public presentation channel
        const audienceChannel = pusherInstance.subscribe(`presentation.${presentation.uid}`);
        
        // Bind to slide-change events coming from the server
        audienceChannel.bind('slide-change', (data: { slideIndex: number }) => {
          console.log('Received slide change event:', data);
          setCurrentSlideIndex(data.slideIndex);
        });
        
        setChannel(audienceChannel);
      }
      
      // Clean up on unmount
      return () => {
        if (isPresenter) {
          pusherInstance.unsubscribe(`private-presenter-${presentation.id}`);
        } else {
          pusherInstance.unsubscribe(`presentation.${presentation.uid}`);
        }
        pusherInstance.disconnect();
      };
    } catch (error) {
      console.error('Error setting up Pusher:', error);
      
      // Provide fallback functionality
      setChannel({
        bind: () => {},
        unbind_all: () => {},
        trigger: () => {
          console.warn('Real-time messaging disabled due to error');
          return false;
        }
      });
    }
  }, [presentation.id, presentation.uid, isPresenter]);

  // Track current slide for participants
  useEffect(() => {
    if (sessionId) {
      axios.post(route('participant.update-slide'), {
        session_id: sessionId,
        slide_number: currentSlideIndex,
      }).catch(console.error);
      
      // Also track this as an analytic event
      axios.post(route('analytics.track'), {
        session_id: sessionId,
        presentation_uid: presentation.uid,
        event_type: 'slide_view',
        slide_id: presentation.slides[currentSlideIndex]?.id,
        data: {
          timestamp: new Date().toISOString(),
        },
      }).catch(console.error);
    }
  }, [currentSlideIndex, sessionId, presentation.uid]);

  // Fetch participants list for presenter
  useEffect(() => {
    if (isPresenter) {
      const fetchParticipants = async () => {
        try {
          const response = await axios.get(route('presentations.participants', presentation.id));
          setParticipants(response.data.participants);
        } catch (error) {
          console.error('Error fetching participants:', error);
        }
      };
      
      fetchParticipants();
      
      // Set up interval to refresh participants list
      const intervalId = setInterval(fetchParticipants, 10000);
      
      return () => clearInterval(intervalId);
    }
  }, [isPresenter, presentation.id]);

  // Navigation functions
  const previousSlide = () => {
    if (currentSlideIndex > 0) {
      const newIndex = currentSlideIndex - 1;
      setCurrentSlideIndex(newIndex);
      
      if (isPresenter) {
        // Send an AJAX request to the server to broadcast the slide change
        axios.post(route('participant.update-slide'), {
          presentation_uid: presentation.uid,
          slide_number: newIndex,
          is_presenter: true
        }).catch(error => {
          console.error('Error broadcasting slide change:', error);
        });
      }
    }
  };

  const nextSlide = () => {
    if (currentSlideIndex < presentation.slides.length - 1) {
      const newIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(newIndex);
      
      if (isPresenter) {
        // Send an AJAX request to the server to broadcast the slide change
        axios.post(route('participant.update-slide'), {
          presentation_uid: presentation.uid,
          slide_number: newIndex,
          is_presenter: true
        }).catch(error => {
          console.error('Error broadcasting slide change:', error);
        });
      }
    }
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < presentation.slides.length) {
      setCurrentSlideIndex(index);
      
      if (isPresenter) {
        // Send an AJAX request to the server to broadcast the slide change
        axios.post(route('participant.update-slide'), {
          presentation_uid: presentation.uid,
          slide_number: index,
          is_presenter: true
        }).catch(error => {
          console.error('Error broadcasting slide change:', error);
        });
      }
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        previousSlide();
      } else if (e.key === 'h') {
        setShowControls(!showControls);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlideIndex, presentation.slides.length, isPresenter, channel, showControls]);

  const renderSlide = (slide: Slide) => {
    switch (slide.type) {
      case 'title':
        return <TitleSlide content={slide.content} theme={presentation.theme} />;
      case 'content':
        return <ContentSlide content={slide.content} theme={presentation.theme} />;
      case 'scroll':
        return <ScrollContainerSlide content={slide.content} theme={presentation.theme} />;
      case 'comparison':
        return <ComparisonTableSlide content={slide.content} theme={presentation.theme} />;
      case 'diagram':
        return <DiagramSlide content={slide.content} theme={presentation.theme} />;
      default:
        return (
          <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <div className="text-center">
              <h2 className="text-2xl">Unknown slide type</h2>
            </div>
          </div>
        );
    }
  };

  const currentSlide = presentation.slides[currentSlideIndex];

  const getThemeClass = () => {
    switch (presentation.theme) {
      case 'dark':
        return 'bg-gray-900 text-white';
      case 'light':
        return 'bg-white text-gray-900';
      case 'gradient':
        return 'bg-gradient-to-br from-slate-900 to-amber-900 text-white';
      default:
        return 'bg-gradient-to-br from-slate-900 to-amber-900 text-white';
    }
  };

  return (
    <>
      <Head title={`Presenting: ${presentation.title}`} />

      <div className={`min-h-screen ${getThemeClass()}`}>
        {currentSlide ? (
          renderSlide(currentSlide)
        ) : (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h2 className="text-2xl">No slides available</h2>
            </div>
          </div>
        )}

        {isPresenter && showControls && (
          <PresenterControls
            presentation={presentation}
            currentSlideIndex={currentSlideIndex}
            totalSlides={presentation.slides.length}
            participants={participants}
            previousSlide={previousSlide}
            nextSlide={nextSlide}
            goToSlide={goToSlide}
          />
        )}

        {!isPresenter && (
          <div className={`fixed bottom-0 left-0 right-0 p-4 ${showControls ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            <div className="flex justify-center items-center">
              <span className="text-sm bg-black/30 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                Slide {currentSlideIndex + 1} of {presentation.slides.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 