import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PresentationChartBarIcon } from '@heroicons/react/24/outline';

export default function Dashboard({ auth }: any) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                            Welcome to the Interactive Presentation Platform
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-6">
                                <div className="flex items-start mb-4">
                                    <div className="bg-amber-500 p-2 rounded-lg mr-4">
                                        <PresentationChartBarIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">My Presentations</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage your presentations</p>
                                    </div>
                                </div>
                                <Link
                                    href={route('presentations.index')}
                                    className="block w-full bg-amber-500 hover:bg-amber-600 text-white text-center px-4 py-2 rounded transition-colors"
                                >
                                    Go to Presentations
                                </Link>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                <div className="flex items-start mb-4">
                                    <div className="bg-gray-500 p-2 rounded-lg mr-4">
                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">Documentation</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Learn how to use the platform</p>
                                    </div>
                                </div>
                                <a
                                    href="#"
                                    className="block w-full bg-gray-500 hover:bg-gray-600 text-white text-center px-4 py-2 rounded transition-colors"
                                >
                                    View Documentation
                                </a>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                <div className="flex items-start mb-4">
                                    <div className="bg-gray-500 p-2 rounded-lg mr-4">
                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">Templates</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Browse presentation templates</p>
                                    </div>
                                </div>
                                <a
                                    href="#"
                                    className="block w-full bg-gray-500 hover:bg-gray-600 text-white text-center px-4 py-2 rounded transition-colors"
                                >
                                    Browse Templates
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
