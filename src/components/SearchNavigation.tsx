'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Menu, X, Search, Filter, ChevronDown } from 'lucide-react';
import Button from './Button';

interface SearchNavigationProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

export default function SearchNavigation({ 
  searchQuery, 
  setSearchQuery, 
  showFilters, 
  setShowFilters,
  hasActiveFilters,
  clearFilters
}: SearchNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b border-blue-800 sticky top-0 z-50" style={{ backgroundColor: '#021fdf' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-black text-white">
              RUNHUB
            </span>
          </Link>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <div className="flex items-center rounded-full border-2 border-gray-200 overflow-hidden bg-white hover:border-[#021fdf] transition-colors">
                  <Search className="absolute left-4 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City, Town, Suburb, Postcode..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 pl-10 pr-4 py-2 text-gray-900 bg-white focus:outline-none text-sm"
                  />
                  <ChevronDown className="absolute right-4 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-[#021fdf] text-white font-medium rounded-full hover:opacity-90 transition-colors text-sm"
              >
                <Filter className="h-4 w-4 mr-1" />
                Filters
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 transition-colors text-sm"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

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
          <div className="absolute right-0 top-16 w-64 bg-white border border-gray-200 rounded-lg shadow-lg" style={{ marginRight: '1rem' }}>
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
                href="/search" 
                className="text-gray-600 hover:bg-gray-50 font-medium px-4 py-3 transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = '#021fdf'}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
                onClick={() => setIsMenuOpen(false)}
              >
                SEARCH
              </Link>
              <Link 
                href="/all-clubs" 
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