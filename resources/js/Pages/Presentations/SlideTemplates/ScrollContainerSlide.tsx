import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface Section {
  title: string;
  content: string;
  useMarkdown?: boolean;
}

interface ScrollContainerSlideProps {
  content: {
    containerTitle?: string;
    sections?: Section[];
  };
  theme: string;
}

export default function ScrollContainerSlide({ content, theme }: ScrollContainerSlideProps) {
  const { containerTitle, sections = [] } = content;
  const containerRef = useRef<HTMLDivElement>(null);

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
        return 'bg-black/5 backdrop-blur-md border border-black/10';
      case 'dark':
        return 'bg-white/5 backdrop-blur-md border border-white/20';
      case 'gradient':
        return 'bg-white/5 backdrop-blur-md border border-white/20';
      default:
        return 'bg-white/5 backdrop-blur-md border border-white/20';
    }
  };

  const renderSectionContent = (section: Section, index: number) => {
    if (section.useMarkdown) {
      return (
        <div className={`prose ${theme === 'light' ? 'prose-slate' : 'prose-invert'} max-w-none`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {section.content}
          </ReactMarkdown>
        </div>
      );
    } else {
      return (
        <div className={`prose ${theme === 'light' ? 'prose-slate' : 'prose-invert'} max-w-none`}>
          {section.content.split('\n').map((paragraph, pidx) => (
            <p key={pidx} className={`${theme === 'light' ? 'text-gray-700' : 'text-white/80'} mb-4`}>{paragraph}</p>
          ))}
        </div>
      );
    }
  };

  return (
    <div className={`w-full h-screen flex flex-col ${getBackgroundClass()} ${getTextColorClass()}`}>
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-30">
        <div className="text-xl font-bold">
          {containerTitle || 'Scrollable Content'}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-16 left-0 right-0 text-center z-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold">{containerTitle || 'Scrollable Content'}</h2>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center p-8 pt-32">
        <div className="w-full max-w-6xl">
          <div className={`w-full h-[65vh] ${getGlassmorphicBgClass()} rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] relative flex flex-col`}>
            <div 
              ref={containerRef}
              className="overflow-y-auto overflow-x-hidden flex-1 scroll-smooth p-4 md:p-8"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: theme === 'light' ? 'rgba(0, 0, 0, 0.2) transparent' : 'rgba(255, 255, 255, 0.1) transparent'
              }}
            >
              {sections.length === 0 ? (
                <div className={`h-full flex items-center justify-center ${theme === 'light' ? 'text-gray-400' : 'text-white/60'}`}>
                  <p>No content sections defined</p>
                </div>
              ) : (
                sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3, root: containerRef }}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.8, delay: 0.1 * index }}
                    className="mb-12"
                  >
                    <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                    {renderSectionContent(section, index)}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 