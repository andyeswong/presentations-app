import React from 'react';
import { motion } from 'framer-motion';

interface Row {
  left: string;
  right: string;
}

interface ComparisonTableSlideProps {
  content: {
    tableTitle?: string;
    leftColumnTitle?: string;
    rightColumnTitle?: string;
    rows?: Row[];
  };
  theme: string;
}

export default function ComparisonTableSlide({ content, theme }: ComparisonTableSlideProps) {
  const { 
    tableTitle = 'Comparison',
    leftColumnTitle = 'Option A',
    rightColumnTitle = 'Option B',
    rows = []
  } = content;

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

  const getGlassmorphicBgClass = () => {
    switch (theme) {
      case 'light':
        return 'bg-black/5 backdrop-blur-sm border border-black/10';
      case 'dark':
      case 'gradient':
      default:
        return 'bg-white/10 backdrop-blur-sm';
    }
  };

  return (
    <div className={`w-full h-screen flex flex-col ${getBackgroundClass()} ${getTextColorClass()}`}>
      <div className="flex-1 p-16 overflow-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">{tableTitle || 'Comparison'}</h2>
        </motion.div>
        
        <div className="max-w-6xl mx-auto">
          {rows.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No comparison data provided
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center mb-4">
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl font-bold mb-2"
                >
                  {leftColumnTitle || 'Option A'}
                </motion.h3>
              </div>
              
              <div className="text-center mb-4">
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl font-bold mb-2"
                >
                  {rightColumnTitle || 'Option B'}
                </motion.h3>
              </div>
              
              {rows.map((row, index) => (
                <React.Fragment key={index}>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                    className={`${getGlassmorphicBgClass()} p-4 rounded-lg`}
                  >
                    <div className="text-lg">{row.left}</div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                    className={`${getGlassmorphicBgClass()} p-4 rounded-lg`}
                  >
                    <div className="text-lg">{row.right}</div>
                  </motion.div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 