import React, { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link } from '@inertiajs/react';

interface Presentation {
  id: number;
  title: string;
  uid: string;
}

interface PageProps {
  presentation: Presentation;
  auth: any;
}

export default function PresenterAuth({ presentation, auth }: PageProps) {
  const { data, setData, post, processing, errors } = useForm({
    password: '',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    post(route('presentations.authenticate', presentation.id));
  };

  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const getGlassmorphicClass = () => {
    return isDarkMode 
      ? 'bg-white/10 backdrop-blur-md border border-white/20' 
      : 'bg-black/5 backdrop-blur-md border border-black/10';
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-amber-100 to-amber-300 dark:from-slate-900 dark:to-amber-900 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/3 w-96 h-96 bg-amber-400 dark:bg-amber-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute right-1/4 bottom-1/3 w-96 h-96 bg-amber-300 dark:bg-amber-700 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute left-1/3 bottom-1/4 w-96 h-96 bg-amber-200 dark:bg-amber-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {presentation.title}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Please enter the presenter password to continue
        </p>
      </div>

      <div className={`max-w-md w-full ${getGlassmorphicClass()} rounded-xl p-8 shadow-lg`}>
        <div className="mb-6 flex justify-center">
          <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full">
            <LockClosedIcon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        <form onSubmit={submit}>
          <div>
            <InputLabel htmlFor="password" value="Presenter Password" className="text-gray-800 dark:text-gray-200" />

            <TextInput
              id="password"
              type="password"
              name="password"
              value={data.password}
              className="mt-1 block w-full text-gray-900 dark:text-white bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700"
              autoComplete="current-password"
              onChange={(e) => setData('password', e.target.value)}
            />

            <InputError message={errors.password} className="mt-2" />
          </div>

          <div className="mt-6">
            <PrimaryButton disabled={processing} className="w-full justify-center">
              Continue to Presentation
            </PrimaryButton>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <Link href={route('dashboard')} className="text-amber-600 dark:text-amber-400 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
} 