'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { X } from 'lucide-react';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const mobileMenuRef = useRef(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  // Helper to close menu
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
    router.push('/');
  };

  const scrollToSection = (sectionId) => {
    // If we are not on the homepage, navigate home first
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
      closeMobileMenu();
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
    closeMobileMenu();
  };

  // Automatically close mobile menu when the route changes
  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Helper to determine dashboard link
  const dashboardLink = currentUser?.role === 'employer' 
    ? '/employer/dashboard' 
    : '/candidate/dashboard';

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm" ref={mobileMenuRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={closeMobileMenu}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
              <span className="font-black text-xl">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">PANDA TALENT</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-500 cursor-pointer hover:text-blue-600 text-sm font-semibold transition-colors">Home</button>
            <button onClick={() => scrollToSection('our-solution')} className="text-gray-500 cursor-pointer hover:text-blue-600 text-sm font-semibold transition-colors">Solution</button>
            <button onClick={() => scrollToSection('about')} className="text-gray-500 cursor-pointer hover:text-blue-600 text-sm font-semibold transition-colors">About</button>
          </nav>

          {/* Dynamic Auth Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link href={dashboardLink} className="text-sm font-bold text-gray-700 hover:text-blue-600 px-4">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="cursor-pointer rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-gray-800 transition-all active:scale-95"
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
            <button onClick={toggleMobileMenu} className="text-gray-700 p-2 focus:outline-none">
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
            <button onClick={() => scrollToSection('home')} className="text-left font-bold text-gray-700 py-2">Home</button>
            <button onClick={() => scrollToSection('our-solution')} className="text-left font-bold text-gray-700 py-2">Solution</button>
            <button onClick={() => scrollToSection('about')} className="text-left font-bold text-gray-700 py-2">About</button>
            
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
              {currentUser ? (
                <>
                  <Link 
                    href={dashboardLink} 
                    onClick={closeMobileMenu}
                    className="text-center font-bold text-blue-600 py-2"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold active:scale-95 transition-transform"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    onClick={closeMobileMenu}
                    className="text-center font-bold text-gray-700 py-2"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/signup" 
                    onClick={closeMobileMenu}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl text-center font-bold shadow-lg shadow-blue-100 active:scale-95 transition-transform"
                  >
                    Join Panda
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}