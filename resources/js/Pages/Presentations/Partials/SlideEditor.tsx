import React, { useEffect, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

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

interface SlideEditorProps {
  slide: Slide;
  updateSlide: (slideData: Partial<Slide>) => void;
}

export default function SlideEditor({ slide, updateSlide }: SlideEditorProps) {
  const [title, setTitle] = useState(slide.title || '');
  const [content, setContent] = useState(slide.content || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setTitle(slide.title || '');
    setContent(slide.content || {});
  }, [slide]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (field: string, value: any) => {
    setContent({
      ...content,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const validationErrors: Record<string, string> = {};
    if (!title) {
      validationErrors.title = 'The title field is required';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    updateSlide({
      title,
      content,
    });
    
    // Clear errors
    setErrors({});
  };

  const renderTitleSlideEditor = () => (
    <div className="space-y-4">
      <div>
        <InputLabel htmlFor="content-title" value="Main Title" />
        <TextInput
          id="content-title"
          name="content-title"
          value={content.title || ''}
          className="mt-1 block w-full"
          onChange={(e) => handleContentChange('title', e.target.value)}
        />
      </div>
      
      <div>
        <InputLabel htmlFor="content-subtitle" value="Subtitle" />
        <TextInput
          id="content-subtitle"
          name="content-subtitle"
          value={content.subtitle || ''}
          className="mt-1 block w-full"
          onChange={(e) => handleContentChange('subtitle', e.target.value)}
        />
      </div>
      
      <div>
        <InputLabel htmlFor="content-backgroundImage" value="Background Image URL (optional)" />
        <TextInput
          id="content-backgroundImage"
          name="content-backgroundImage"
          value={content.backgroundImage || ''}
          className="mt-1 block w-full"
          onChange={(e) => handleContentChange('backgroundImage', e.target.value)}
        />
      </div>
    </div>
  );

  const renderContentSlideEditor = () => (
    <div className="space-y-4">
      <div>
        <InputLabel htmlFor="content-heading" value="Heading" />
        <TextInput
          id="content-heading"
          name="content-heading"
          value={content.heading || ''}
          className="mt-1 block w-full"
          onChange={(e) => handleContentChange('heading', e.target.value)}
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <InputLabel htmlFor="content-body" value="Body Text" />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="use-markdown"
              className="mr-2 rounded border-gray-300 text-amber-500 shadow-sm focus:ring-amber-500"
              checked={content.useMarkdown || false}
              onChange={(e) => handleContentChange('useMarkdown', e.target.checked)}
            />
            <label htmlFor="use-markdown" className="text-sm text-gray-600">Use Markdown</label>
          </div>
        </div>
        <textarea
          id="content-body"
          name="content-body"
          value={content.body || ''}
          rows={5}
          className={`mt-1 block w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm ${content.useMarkdown ? 'font-mono text-sm' : ''}`}
          onChange={(e) => handleContentChange('body', e.target.value)}
          placeholder={content.useMarkdown ? '# Heading\n\n- Bullet point\n- Another point\n\n**Bold text** and *italic text*\n\n```\nCode block\n```' : ''}
        />
        {content.useMarkdown && (
          <div className="text-xs text-gray-500 mt-1">
            Markdown formatting is supported. Use # for headings, - for lists, **bold**, *italic*, [links](url), and ```code blocks```.
          </div>
        )}
      </div>
      
      <div>
        <InputLabel htmlFor="content-imageUrl" value="Image URL (optional)" />
        <TextInput
          id="content-imageUrl"
          name="content-imageUrl"
          value={content.imageUrl || ''}
          className="mt-1 block w-full"
          onChange={(e) => handleContentChange('imageUrl', e.target.value)}
        />
      </div>
      
      <div>
        <InputLabel htmlFor="content-layout" value="Layout" />
        <select
          id="content-layout"
          name="content-layout"
          value={content.layout || 'standard'}
          className="mt-1 block w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm"
          onChange={(e) => handleContentChange('layout', e.target.value)}
        >
          <option value="standard">Standard</option>
          <option value="two-column">Two Columns</option>
          <option value="image-left">Image Left</option>
          <option value="image-right">Image Right</option>
        </select>
      </div>
    </div>
  );

  const renderScrollContainerEditor = () => (
    <div className="space-y-4">
      <div>
        <InputLabel htmlFor="content-containerTitle" value="Container Title" />
        <TextInput
          id="content-containerTitle"
          name="content-containerTitle"
          value={content.containerTitle || ''}
          className="mt-1 block w-full"
          onChange={(e) => handleContentChange('containerTitle', e.target.value)}
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <InputLabel htmlFor="content-sections" value="Sections (one per line, use --- to separate)" />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="use-markdown-sections"
              className="mr-2 rounded border-gray-300 text-amber-500 shadow-sm focus:ring-amber-500"
              checked={content.useMarkdownSections || false}
              onChange={(e) => handleContentChange('useMarkdownSections', e.target.checked)}
            />
            <label htmlFor="use-markdown-sections" className="text-sm text-gray-600">Use Markdown in Sections</label>
          </div>
        </div>
        <textarea
          id="content-sections"
          name="content-sections"
          value={Array.isArray(content.sections) 
            ? content.sections.map((s: any) => `${s.title || ''}:${s.content || ''}`).join('\n---\n') 
            : ''}
          rows={8}
          className={`mt-1 block w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm ${content.useMarkdownSections ? 'font-mono text-sm' : ''}`}
          onChange={(e) => {
            const text = e.target.value;
            const sectionTexts = text.split('\n---\n');
            const sections = sectionTexts.map(section => {
              const [title, sectionContent] = section.split(':', 2);
              return { 
                title, 
                content: sectionContent || '',
                useMarkdown: content.useMarkdownSections || false
              };
            });
            handleContentChange('sections', sections);
          }}
          placeholder={content.useMarkdownSections ? 
            "Section Title:# Markdown Content\n\n- List item\n- Another item\n\n**Bold text** and *italic text*\n---\nAnother Section:## Subheading\n\nMore content here with [link](https://example.com)" 
            : ""}
        />
        <div className="text-xs text-gray-500 mt-1">
          Format each section as "Title:Content" with "---" between sections
          {content.useMarkdownSections && (
            <span className="block mt-1">
              Markdown formatting is supported in section content. Use # for headings, - for lists, etc.
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const renderComparisonTableEditor = () => (
    <div className="space-y-4">
      <div>
        <InputLabel htmlFor="content-tableTitle" value="Table Title" />
        <TextInput
          id="content-tableTitle"
          name="content-tableTitle"
          value={content.tableTitle || ''}
          className="mt-1 block w-full"
          onChange={(e) => handleContentChange('tableTitle', e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputLabel htmlFor="content-leftColumnTitle" value="Left Column Title" />
          <TextInput
            id="content-leftColumnTitle"
            name="content-leftColumnTitle"
            value={content.leftColumnTitle || ''}
            className="mt-1 block w-full"
            onChange={(e) => handleContentChange('leftColumnTitle', e.target.value)}
          />
        </div>
        
        <div>
          <InputLabel htmlFor="content-rightColumnTitle" value="Right Column Title" />
          <TextInput
            id="content-rightColumnTitle"
            name="content-rightColumnTitle"
            value={content.rightColumnTitle || ''}
            className="mt-1 block w-full"
            onChange={(e) => handleContentChange('rightColumnTitle', e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <InputLabel htmlFor="content-rows" value="Table Rows (one per line, use | to separate columns)" />
        <textarea
          id="content-rows"
          name="content-rows"
          value={Array.isArray(content.rows) 
            ? content.rows.map((row: any) => `${row.left || ''}|${row.right || ''}`).join('\n') 
            : ''}
          rows={6}
          className="mt-1 block w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm"
          onChange={(e) => {
            const text = e.target.value;
            const rowTexts = text.split('\n');
            const rows = rowTexts.map(row => {
              const [left, right] = row.split('|', 2);
              return { left, right: right || '' };
            });
            handleContentChange('rows', rows);
          }}
        />
        <div className="text-xs text-gray-500 mt-1">
          Format each row as "Left Column|Right Column"
        </div>
      </div>
    </div>
  );

  const renderDiagramEditor = () => (
    <div className="space-y-4">
      <div>
        <InputLabel htmlFor="content-diagramTitle" value="Diagram Title" />
        <TextInput
          id="content-diagramTitle"
          name="content-diagramTitle"
          value={content.diagramTitle || ''}
          className="mt-1 block w-full"
          onChange={(e) => handleContentChange('diagramTitle', e.target.value)}
        />
      </div>
      
      <div>
        <InputLabel htmlFor="content-diagramType" value="Diagram Type" />
        <select
          id="content-diagramType"
          name="content-diagramType"
          value={content.diagramType || 'flow'}
          className="mt-1 block w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm"
          onChange={(e) => handleContentChange('diagramType', e.target.value)}
        >
          <option value="flow">Flow Chart</option>
          <option value="process">Process</option>
          <option value="cycle">Cycle</option>
        </select>
      </div>
      
      <div>
        <InputLabel htmlFor="content-steps" value="Steps (one per line)" />
        <textarea
          id="content-steps"
          name="content-steps"
          value={Array.isArray(content.steps) 
            ? content.steps.map((step: any) => step.text || '').join('\n') 
            : ''}
          rows={6}
          className="mt-1 block w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm"
          onChange={(e) => {
            const text = e.target.value;
            const stepTexts = text.split('\n');
            const steps = stepTexts.map((text, index) => ({
              id: index + 1,
              text
            }));
            handleContentChange('steps', steps);
          }}
        />
      </div>
    </div>
  );

  const renderSlideContentEditor = () => {
    switch (slide.type) {
      case 'title':
        return renderTitleSlideEditor();
      case 'content':
        return renderContentSlideEditor();
      case 'scroll':
        return renderScrollContainerEditor();
      case 'comparison':
        return renderComparisonTableEditor();
      case 'diagram':
        return renderDiagramEditor();
      default:
        return <div>Unknown slide type</div>;
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">
        Edit Slide: {slide.title || `Slide #${slide.order + 1}`}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <InputLabel htmlFor="slide-title" value="Slide Title (for editor only)" />
            <TextInput
              id="slide-title"
              name="slide-title"
              value={title}
              className="mt-1 block w-full"
              onChange={handleTitleChange}
            />
            {errors.title && <InputError message={errors.title} className="mt-2" />}
          </div>

          <div>
            <InputLabel value="Slide Content" />
            <div className="mt-3 p-4 border border-gray-200 rounded-md">
              {renderSlideContentEditor()}
            </div>
          </div>

          <div className="flex justify-end">
            <PrimaryButton type="submit">
              Save Slide
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
} 