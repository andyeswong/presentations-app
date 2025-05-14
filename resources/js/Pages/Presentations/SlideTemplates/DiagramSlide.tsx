import React from 'react';
import { motion } from 'framer-motion';

interface Step {
  id: number;
  text: string;
}

interface DiagramSlideProps {
  content: {
    diagramTitle?: string;
    diagramType?: 'flow' | 'process' | 'cycle';
    steps?: Step[];
  };
  theme: string;
}

export default function DiagramSlide({ content, theme }: DiagramSlideProps) {
  const { 
    diagramTitle = 'Process Diagram',
    diagramType = 'flow',
    steps = []
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
        return 'bg-white/10 backdrop-blur-sm border border-white/10';
    }
  };

  const renderFlowDiagram = () => (
    <div className="max-w-5xl mx-auto">
      {steps.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          No steps defined
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-64 ${getGlassmorphicBgClass()} p-4 rounded-lg text-center relative z-10`}
              >
                {step.text}
              </div>
              {index < steps.length - 1 && (
                <div className="h-16 w-0.5 bg-white/20 dark:bg-white/20 light:bg-black/20"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProcessDiagram = () => (
    <div className="max-w-5xl mx-auto">
      {steps.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          No steps defined
        </div>
      ) : (
        <div className="mt-16 flex flex-wrap justify-center gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`w-64 ${getGlassmorphicBgClass()} p-4 rounded-lg relative`}
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <div className="mt-2">{step.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCycleDiagram = () => {
    const angles = steps.map((_, i) => {
      const angleInRadians = ((2 * Math.PI) / steps.length) * i - Math.PI / 2;
      return {
        x: 150 + 120 * Math.cos(angleInRadians),
        y: 150 + 120 * Math.sin(angleInRadians),
      };
    });

    return (
      <div className="flex justify-center mt-16">
        <div className="relative w-[300px] h-[300px]">
          {/* Center circle */}
          <div className={`absolute w-24 h-24 rounded-full ${getGlassmorphicBgClass()} flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
            {diagramTitle}
          </div>

          {/* Steps */}
          {steps.map((step, index) => (
            <div
              key={index}
              className={`absolute w-36 h-36 ${getGlassmorphicBgClass()} p-3 rounded-full flex items-center justify-center text-center transform -translate-x-1/2 -translate-y-1/2`}
              style={{
                left: angles[index].x + 'px',
                top: angles[index].y + 'px',
              }}
            >
              {step.text}
            </div>
          ))}

          {/* Connecting lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {steps.map((_, index) => {
              const nextIndex = (index + 1) % steps.length;
              return (
                <line
                  key={index}
                  x1={angles[index].x}
                  y1={angles[index].y}
                  x2={angles[nextIndex].x}
                  y2={angles[nextIndex].y}
                  stroke={theme === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const renderDiagram = () => {
    switch (diagramType) {
      case 'flow':
        return renderFlowDiagram();
      case 'process':
        return renderProcessDiagram();
      case 'cycle':
        return renderCycleDiagram();
      default:
        return renderFlowDiagram();
    }
  };

  return (
    <div className={`w-full h-screen flex flex-col ${getBackgroundClass()} ${getTextColorClass()}`}>
      <div className="flex-1 p-16 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold">{diagramTitle}</h2>
        </motion.div>

        {renderDiagram()}
      </div>
    </div>
  );
} 