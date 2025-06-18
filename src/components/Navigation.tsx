'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Button from './Button';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b border-blue-800 sticky top-0 z-50" style={{ backgroundColor: '#021fdf' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/RUNHUB logos (1).png" 
              alt="RUNHUB" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Add Your Club Button + Burger Menu */}
          <div className="flex items-center space-x-4">
            {/* ADD YOUR CLUB Button */}
            <Button href="/add-club" variant="primary" size="md">
              ADD YOUR CLUB
            </Button>
            
            {/* Burger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:opacity-80 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Burger Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute right-0 top-16 w-64 bg-white border border-gray-200 rounded-lg shadow-2xl" style={{ marginRight: '1rem', zIndex: '9999 !important' }}>
            <div className="flex flex-col py-2">
              <Link 
                href="/" 
                className="text-gray-600 hover:bg-gray-50 font-medium px-4 py-3 transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = '#021fdf'}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
                onClick={() => setIsMenuOpen(false)}
              >
                HOME
              </Link>
              <Link 
                href="/clubs" 
                className="text-gray-600 hover:bg-gray-50 font-medium px-4 py-3 transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = '#021fdf'}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
                onClick={() => setIsMenuOpen(false)}
              >
                SEARCH
              </Link>
              <Link 
                href="/directory" 
                className="text-gray-600 hover:bg-gray-50 font-medium px-4 py-3 transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = '#021fdf'}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
                onClick={() => setIsMenuOpen(false)}
              >
                ALL CLUBS
              </Link>
              <Link 
                href="/faq" 
                className="text-gray-600 hover:bg-gray-50 font-medium px-4 py-3 transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = '#021fdf'}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                href="/about" 
                className="text-gray-600 hover:bg-gray-50 font-medium px-4 py-3 transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = '#021fdf'}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
                onClick={() => setIsMenuOpen(false)}
              >
                ABOUT US
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-600 hover:bg-gray-50 font-medium px-4 py-3 transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = '#021fdf'}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
                onClick={() => setIsMenuOpen(false)}
              >
                CONTACT US
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 