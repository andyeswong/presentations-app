import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PlusIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import SlidePreviewCard from './Partials/SlidePreviewCard';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

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
  created_at: string;
  updated_at: string;
  slides: Slide[];
}

interface PageProps {
  auth: any;
  presentations: Presentation[];
}

export default function Index({ auth, presentations }: PageProps) {
  const [confirmingDeletion, setConfirmingDeletion] = useState(false);
  const [presentationToDelete, setPresentationToDelete] = useState<Presentation | null>(null);

  const confirmDelete = (presentation: Presentation) => {
    setPresentationToDelete(presentation);
    setConfirmingDeletion(true);
  };

  const closeModal = () => {
    setPresentationToDelete(null);
    setConfirmingDeletion(false);
  };

  const deletePresentation = () => {
    if (presentationToDelete) {
      router.delete(route('presentations.destroy', presentationToDelete.id), {
        onSuccess: () => {
          closeModal();
        },
      });
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Presentations</h2>
          <Link
            href={route('presentations.create')}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Presentation
          </Link>
        </div>
      }
    >
      <Head title="Presentations" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {presentations.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">You don't have any presentations yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first presentation to get started</p>
                <Link
                  href={route('presentations.create')}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Presentation
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {presentations.map((presentation) => (
                <div
                  key={presentation.id}
                  className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-shadow relative"
                >
                  {/* Slide Preview Background */}
                  {presentation.slides && presentation.slides.length > 0 && (
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="opacity-60 h-full">
                        <SlidePreviewCard 
                          slide={presentation.slides[0]} 
                          theme={presentation.theme}
                        />
                      </div>
                      {/* Semi-transparent overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-800/60 dark:from-gray-900/80 to-transparent"></div>
                    </div>
                  )}
                  
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 relative z-10">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">
                      {presentation.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {presentation.description || 'No description'}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span className="mr-4">
                        Theme: {presentation.theme}
                      </span>
                      <span>
                        {presentation.is_public ? 'Public' : 'Private'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex space-x-2">
                        <Link
                          href={route('presentations.edit', presentation.id)}
                          className="text-gray-700 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                        >
                          Edit
                        </Link>
                        <Link
                          href={route('presentations.show', presentation.id)}
                          className="text-gray-700 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                        >
                          View
                        </Link>
                      </div>
                      
                      <div className="flex space-x-3 items-center">
                        <Link
                          href={route('present', presentation.uid)}
                          className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                          target="_blank"
                        >
                          Present
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            confirmDelete(presentation);
                          }}
                          className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors flex items-center group relative"
                          aria-label="Delete presentation"
                        >
                          <TrashIcon className="h-5 w-5" />
                          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Delete
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={confirmingDeletion} onClose={closeModal}>
        <div className="p-6">
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Delete Presentation
              </h2>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete <span className="font-medium text-gray-900 dark:text-gray-100">"{presentationToDelete?.title}"</span>?
              </p>
              
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                This action cannot be undone. All slides and content will be permanently removed.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <SecondaryButton onClick={closeModal}>
              Cancel
            </SecondaryButton>

            <DangerButton onClick={deletePresentation} className="px-4">
              Delete Presentation
            </DangerButton>
          </div>
        </div>
      </Modal>
    </AuthenticatedLayout>
  );
} 