import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { PresentationChartBarIcon } from '@heroicons/react/24/outline';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-amber-50 to-amber-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-amber-900">
            <div className="text-center">
                <Link href="/" className="flex flex-col items-center">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 rounded-xl shadow-lg mb-2">
                        <PresentationChartBarIcon className="w-16 h-16 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mt-2">
                        Enteracloud<span className="text-amber-600 dark:text-amber-400">Presentations</span>
                    </h1>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg border border-amber-100 dark:border-amber-900/30">
                {children}
            </div>
        </div>
    );
}
