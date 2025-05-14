import React from 'react';
import { motion } from 'framer-motion';

interface TitleSlideProps {
  content: {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
  };
  theme: string;
}

export default function TitleSlide({ content, theme }: TitleSlideProps) {
  const { title, subtitle, backgroundImage } = content;

  const getBackgroundClass = () => {
    if (backgroundImage) {
      return '';
    }
    
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

  return (
    <div 
      className={`w-full h-screen flex flex-col items-center justify-center ${getBackgroundClass()} ${getTextColorClass()}`}
      style={backgroundImage ? {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {}}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-16">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {title || 'Presentation Title'}
          </h1>
          
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl opacity-80 max-w-3xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-8 text-sm opacity-70">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          Powered by Presentation Platform
        </motion.div>
      </div>
    </div>
  );
} 