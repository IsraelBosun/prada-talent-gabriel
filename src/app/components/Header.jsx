'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider'; // Ensure this path is correct
import { useRouter, usePathname } from 'next/navigation';
import { X } from 'lucide-react';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const scrollToSection = (sectionId) => {
    // If we are not on the homepage, navigate home first
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: sectionId === 'home' ? 0 : offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  // Helper to determine dashboard link
  const dashboardLink = currentUser?.role === 'employer' 
    ? '/employer/dashboard' 
    : '/candidate/dashboard';

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
              <span className="font-black text-xl">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">PANDA TALENT</span>
          </Link>

          {/* Navigation - Desktop (Only show anchors on Landing Page) */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-500 hover:text-blue-600 text-sm font-semibold transition-colors">Home</button>
            <button onClick={() => scrollToSection('our-solution')} className="text-gray-500 hover:text-blue-600 text-sm font-semibold transition-colors">Solution</button>
            <button onClick={() => scrollToSection('about')} className="text-gray-500 hover:text-blue-600 text-sm font-semibold transition-colors">About</button>
          </nav>

          {/* Dynamic Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link href={dashboardLink} className="text-sm font-bold text-gray-700 hover:text-blue-600 px-4">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-gray-800 transition-all active:scale-95"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-blue-600 px-4">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                >
                  Join Panda
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-gray-700 p-2">
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <div className="space-y-1.5">
                  <div className="w-6 h-0.5 bg-gray-900"></div>
                  <div className="w-6 h-0.5 bg-gray-900"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-6 space-y-4 animate-in slide-in-from-top-5 duration-300">
          <nav className="flex flex-col space-y-4">
            <button onClick={() => scrollToSection('home')} className="text-left font-bold text-gray-700">Home</button>
            <button onClick={() => scrollToSection('our-solution')} className="text-left font-bold text-gray-700">Solution</button>
            
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
              {currentUser ? (
                <>
                  <Link href={dashboardLink} className="text-center font-bold text-blue-600">Dashboard</Link>
                  <button onClick={handleLogout} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-center font-bold text-gray-700">Log In</Link>
                  <Link href="/signup" className="w-full py-3 bg-blue-600 text-white rounded-xl text-center font-bold">Join Panda</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}