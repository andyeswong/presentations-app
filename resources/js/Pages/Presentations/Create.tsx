import React, { FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import { Transition } from '@headlessui/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Link } from '@inertiajs/react';

interface PageProps {
  auth: any;
}

export default function Create({ auth }: PageProps) {
  const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
    title: '',
    description: '',
    is_public: true,
    theme: 'default',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('presentations.store'));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create Presentation</h2>
      }
    >
      <Head title="Create Presentation" />

      <div className="py-12">
        <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={submit} className="p-6">
              <div className="mt-4">
                <InputLabel htmlFor="title" value="Title" className="text-gray-700 dark:text-gray-300" />
                <TextInput
                  id="title"
                  name="title"
                  value={data.title}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData('title', e.target.value)}
                  required
                />
                <InputError message={errors.title} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="description" value="Description" className="text-gray-700 dark:text-gray-300" />
                <textarea
                  id="description"
                  name="description"
                  value={data.description}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm"
                  onChange={(e) => setData('description', e.target.value)}
                  rows={3}
                />
                <InputError message={errors.description} className="mt-2" />
              </div>

              <div className="mt-4">
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

              <div className="flex items-center justify-end mt-8">
                <Link
                  href={route('presentations.index')}
                  className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 mr-4"
                >
                  Cancel
                </Link>

                <PrimaryButton className="ml-4" disabled={processing}>
                  Create Presentation
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 