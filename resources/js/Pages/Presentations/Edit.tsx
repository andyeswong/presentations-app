import React, { FormEventHandler, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import SlidesList from './Partials/SlidesList';
import SlideEditor from './Partials/SlideEditor';
import SlidePreview from './Partials/SlidePreview';

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
  auth: any;
  presentation: Presentation;
}

export default function Edit({ auth, presentation }: PageProps) {
  const { data, setData, patch, processing, errors } = useForm({
    title: presentation.title,
    description: presentation.description || '',
    is_public: presentation.is_public,
    theme: presentation.theme,
  });

  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(
    presentation.slides.length > 0 ? presentation.slides[0] : null
  );
  
  const [slides, setSlides] = useState<Slide[]>(presentation.slides);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    patch(route('presentations.update', presentation.id));
  };

  const addSlide = async (type: string) => {
    try {
      const response = await axios.post(route('slides.store', presentation.id), {
        title: `New ${type} Slide`,
        type,
        template: type,
        content: {},
      });
      
      const newSlide = response.data;
      setSlides([...slides, newSlide]);
      setSelectedSlide(newSlide);
    } catch (error) {
      console.error('Error adding slide:', error);
    }
  };

  const updateSlide = async (slideData: Partial<Slide>) => {
    if (!selectedSlide) return;
    
    try {
      const response = await axios.put(route('slides.update', selectedSlide.id), slideData);
      
      const updatedSlide = response.data;
      
      setSlides(slides.map(slide => 
        slide.id === updatedSlide.id ? updatedSlide : slide
      ));
      
      setSelectedSlide(updatedSlide);
    } catch (error) {
      console.error('Error updating slide:', error);
    }
  };

  const deleteSlide = async (slideId: number) => {
    if (slides.length <= 1) {
      alert('Cannot delete the last slide');
      return;
    }
    
    try {
      await axios.delete(route('slides.destroy', slideId));
      
      const newSlides = slides.filter(slide => slide.id !== slideId);
      setSlides(newSlides);
      
      if (selectedSlide?.id === slideId) {
        setSelectedSlide(newSlides[0]);
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
    }
  };

  const reorderSlides = async (reorderedSlides: Slide[]) => {
    const slideOrderData = reorderedSlides.map((slide, index) => ({
      id: slide.id,
      order: index
    }));
    
    try {
      await axios.post(route('slides.order', presentation.id), {
        slides: slideOrderData
      });
      
      setSlides(reorderedSlides);
    } catch (error) {
      console.error('Error reordering slides:', error);
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Presentation</h2>
          <div className="flex space-x-4">
            <Link
              href={route('presentations.index')}
              className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            >
              Back to Presentations
            </Link>
            <Link
              href={route('present', presentation.uid)}
              className="text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
              target="_blank"
            >
              Present
            </Link>
          </div>
        </div>
      }
    >
      <Head title={`Edit: ${presentation.title}`} />

      <div className="py-12">
        <div className=" mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <form onSubmit={submit} className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Presentation Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <InputLabel htmlFor="title" value="Title" className="text-gray-700 dark:text-gray-300" />
                  <TextInput
                    id="title"
                    name="title"
                    value={data.title}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('title', e.target.value)}
                    required
                  />
                  <InputError message={errors.title} className="mt-2" />
                </div>

                <div>
                  <InputLabel htmlFor="theme" value="Theme" className="text-gray-700 dark:text-gray-300" />
                  <select
                    id="theme"
                    name="theme"
                    value={data.theme}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm"
                    onChange={(e) => setData('theme', e.target.value)}
                  >
                    <option value="default">Default</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="gradient">Gradient</option>
                  </select>
                  <InputError message={errors.theme} className="mt-2" />
                </div>
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="description" value="Description" className="text-gray-700 dark:text-gray-300" />
                <textarea
                  id="description"
                  name="description"
                  value={data.description}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm"
                  onChange={(e) => setData('description', e.target.value)}
                  rows={2}
                />
                <InputError message={errors.description} className="mt-2" />
              </div>

              <div className="mt-4 flex items-center">
                <Checkbox
                  id="is_public"
                  name="is_public"
                  checked={data.is_public}
                  onChange={(e) => setData('is_public', e.target.checked)}
                />
                <InputLabel htmlFor="is_public" value="Make presentation public" className="ml-2 text-gray-700 dark:text-gray-300" />
                <InputError message={errors.is_public} className="mt-2" />
              </div>
              
              <div className="mt-4">
                <InputLabel value="Presenter Password" className="text-gray-700 dark:text-gray-300" />
                <div className="mt-1 flex items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {presentation.presenter_password}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    (Share this password with co-presenters)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end mt-6">
                <PrimaryButton className="ml-4" disabled={processing}>
                  Save Settings
                </PrimaryButton>
              </div>
            </form>
          </div>

          {/* Main content area with slides list and editor */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Slides list - 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Slides</h3>
                  <div className="relative group">
                    <button
                      type="button"
                      className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 text-sm rounded"
                    >
                      Add Slide
                    </button>
                    <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => addSlide('title')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Title Slide
                        </button>
                        <button
                          onClick={() => addSlide('content')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Content Slide
                        </button>
                        <button
                          onClick={() => addSlide('scroll')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Scroll Container
                        </button>
                        <button
                          onClick={() => addSlide('comparison')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Comparison Table
                        </button>
                        <button
                          onClick={() => addSlide('diagram')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Diagram/Process
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <SlidesList
                  slides={slides}
                  selectedSlide={selectedSlide}
                  onSelectSlide={setSelectedSlide}
                  onDeleteSlide={deleteSlide}
                  onReorderSlides={reorderSlides}
                />
              </div>
            </div>
            
            {/* Editor and Preview - 10 columns split into 5 and 5 */}
            <div className="lg:col-span-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Slide Editor - Left side */}
                <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Slide Editor</h3>
                  {selectedSlide ? (
                    <SlideEditor
                      slide={selectedSlide}
                      updateSlide={updateSlide}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <p className="text-gray-500 dark:text-gray-400">
                        No slide selected. Please select a slide from the list or add a new one.
                      </p>
                    </div>
                  )}
                </div>

                {/* Slide Preview - Right side */}
                <div>
                  {selectedSlide ? (
                    <SlidePreview
                      slide={selectedSlide}
                      theme={data.theme}
                    />
                  ) : (
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6 flex items-center justify-center h-64">
                      <p className="text-gray-500 dark:text-gray-400">
                        No slide selected to preview.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 