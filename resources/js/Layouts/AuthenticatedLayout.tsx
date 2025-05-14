import { useState, PropsWithChildren, ReactNode } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import { User } from '@/types';
import { ChevronDownIcon, ChevronUpIcon, HomeIcon, PlusIcon, PresentationChartBarIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Authenticated({ user, header, children }: PropsWithChildren<{ user: User, header?: ReactNode }>) {
    const [showingUserDropdown, setShowingUserDropdown] = useState(false);
    
    // Custom NavLink component for the sidebar with special styling
    const SidebarNavLink = ({ href, active, children }: { href: string, active: boolean, children: ReactNode }) => {
        return (
            <Link
                href={href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    active
                        ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium border-l-4 border-amber-500 dark:border-amber-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-l-4 border-transparent'
                }`}
            >
                {children}
            </Link>
        );
    };

    // Check if we're on the presentations index page
    const isOnPresentationsPage = route().current('presentations.index');

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            {/* Left Sidebar Navigation - Visible on all screen sizes */}
            <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 min-h-screen flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-amber-500 to-amber-600">
                    <Link href="/" className="flex flex-col items-center">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-white mx-auto" />
                        <div className="mt-2 text-white font-bold text-lg text-center">Enteracloud<span className="text-gray-100">Presentations</span></div>
                    </Link>
                </div>

                {/* Main Navigation Links */}
                <div className="py-4 flex flex-col flex-grow space-y-1 px-4">
                    <SidebarNavLink href={route('dashboard')} active={route().current('dashboard')}>
                        <HomeIcon className="w-5 h-5 mr-3" />
                        <span>Dashboard</span>
                    </SidebarNavLink>
                    
                    <SidebarNavLink href={route('presentations.index')} active={isOnPresentationsPage}>
                        <PresentationChartBarIcon className="w-5 h-5 mr-3" />
                        <span>Presentations</span>
                    </SidebarNavLink>
                </div>
                
                {/* User Profile Section - Bottom of Sidebar */}
                <div className="mt-auto border-t border-gray-100 dark:border-gray-700 p-4">
                    <div 
                        className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowingUserDropdown(!showingUserDropdown)}
                    >
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center mr-3">
                                <span className="text-sm font-semibold">{user.name.charAt(0)}</span>
                            </div>
                            <div>
                                <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
                                    {user.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user.email}
                                </div>
                            </div>
                        </div>
                        {showingUserDropdown ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        )}
                    </div>
                    
                    {showingUserDropdown && (
                        <div className="mt-2 py-2 px-1 space-y-1 text-sm">
                            <ResponsiveNavLink href={route('profile.edit')} active={route().current('profile.edit')} className="flex items-center px-3 py-2 rounded-md">
                                <UserIcon className="h-4 w-4 mr-2" />
                                <span>Profile</span>
                            </ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button" className="w-full text-left flex items-center px-3 py-2 rounded-md">
                                <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Log Out</span>
                            </ResponsiveNavLink>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area - Takes remaining width */}
            <div className="flex-1 flex flex-col p-4 relative">
                <main className="flex-1">{children}</main>
                
                {/* Floating Action Button for creating presentations */}
                {isOnPresentationsPage && (
                    <Link
                        href={route('presentations.create')}
                        className="fixed bottom-8 right-8 h-14 w-14 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-lg flex items-center justify-center hover:from-amber-600 hover:to-amber-700 transition-colors duration-200 z-10"
                    >
                        <PlusIcon className="h-8 w-8 text-white" />
                    </Link>
                )}
            </div>
        </div>
    );
}
