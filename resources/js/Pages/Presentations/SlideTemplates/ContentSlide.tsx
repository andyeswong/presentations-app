import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface ContentSlideProps {
  content: {
    heading?: string;
    body?: string;
    imageUrl?: string;
    layout?: string;
    useMarkdown?: boolean;
  };
  theme: string;
}

export default function ContentSlide({ content, theme }: ContentSlideProps) {
  const { heading, body, imageUrl, layout = 'standard', useMarkdown = false } = content;

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

  const renderContent = () => {
    // Content to display based on whether markdown is enabled
    const formattedBody = body ? (
      useMarkdown ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-lg max-w-none"
          style={{
            color: 'inherit', 
            // Apply custom styles for prose elements
            // @ts-ignore - Ignore CSS variable TypeScript errors
            '--tw-prose-headings': 'inherit',
            '--tw-prose-body': 'inherit',
            '--tw-prose-bold': 'inherit',
            '--tw-prose-bullets': 'inherit',
            '--tw-prose-quotes': 'inherit',
            '--tw-prose-code': 'inherit',
            '--tw-prose-links': theme === 'light' ? '#b45309' : '#f59e0b',
          }}
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {body}
          </ReactMarkdown>
        </motion.div>
      ) : (
        // Original non-markdown rendering
        <div className="text-lg md:text-xl">
          {body.split('\n').map((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
              return (
                <motion.li 
                  key={index} 
                  className="mb-2 pl-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                >
                  {trimmedLine.substring(1).trim()}
                </motion.li>
              );
            }
            return (
              <motion.p 
                key={index} 
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              >
                {trimmedLine}
              </motion.p>
            );
          })}
        </div>
      )
    ) : null;

    const textContent = (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {heading && (
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {heading}
          </motion.h2>
        )}
        
        {formattedBody}
      </motion.div>
    );

    const imageContent = imageUrl ? (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center items-center"
      >
        <img 
          src={imageUrl} 
          alt={heading || 'Slide content'} 
          className="max-h-[50vh] max-w-full object-contain rounded-lg shadow-lg"
        />
      </motion.div>
    ) : null;

    switch (layout) {
      case 'two-column':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            <div className="flex items-center">
              {textContent}
            </div>
            <div className="flex items-center justify-center">
              {imageContent || (
                <div className="text-center text-gray-500 italic">
                  (No image provided)
                </div>
              )}
            </div>
          </div>
        );
      case 'image-left':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            <div className="flex items-center justify-center">
              {imageContent || (
                <div className="text-center text-gray-500 italic">
                  (No image provided)
                </div>
              )}
            </div>
            <div className="flex items-center">
              {textContent}
            </div>
          </div>
        );
      case 'image-right':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            <div className="flex items-center">
              {textContent}
            </div>
            <div className="flex items-center justify-center">
              {imageContent || (
                <div className="text-center text-gray-500 italic">
                  (No image provided)
                </div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1">
              {textContent}
            </div>
            {imageUrl && (
              <div className="mt-8 flex justify-center">
                {imageContent}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`w-full h-screen flex flex-col ${getBackgroundClass()} ${getTextColorClass()}`}>
      <div className="flex-1 p-16 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
} 