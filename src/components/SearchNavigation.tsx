'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Filter } from 'lucide-react';
import Button from './Button';
import FilterDialog from './FilterDialog';

interface SearchNavigationProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFiltersChange?: (filters: FilterState) => void;
  currentFilters?: FilterState;
  isMobileMapView?: boolean;
}

interface FilterState {
  states: string[];
  meetingDays: string[];
  clubType: string[];
  terrain: string[];
  extracurriculars: string[];
  isPaid: string[];
}

const DEFAULT_FILTERS: FilterState = {
  states: [],
  meetingDays: [],
  clubType: [],
  terrain: [],
  extracurriculars: [],
  isPaid: []
};

// const FILTER_OPTIONS = {
//   states: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
//   meetingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
//   clubType: ['everyone', 'women-only', 'men-only'],
//   terrain: ['grass', 'hills', 'soft-sand', 'track', 'trail-running', 'urban'],
//   extracurriculars: ['coaching', 'parkrun', 'post-run-coffee', 'post-run-drinks', 'post-run-meals', 'post-run-swim', 'social-events'],
//   isPaid: ['free', 'paid']
// };

export default function SearchNavigation({ 
  searchQuery, 
  onSearchChange, 
  onFiltersChange,
  currentFilters = DEFAULT_FILTERS,
  isMobileMapView = false
}: SearchNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Search triggered:', searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    onFiltersChange?.(newFilters);
  };

  const activeFilterCount = Object.values(currentFilters).reduce((total, arr) => total + arr.length, 0);

  // Mobile floating search and filters
  if (isMobileMapView) {
    return (
      <>
        <div className="fixed top-20 left-4 right-4 z-40 md:hidden">
          {/* Search Bar - Enhanced with RUNHUB styling */}
          <div className="mb-4">
            <div 
              className="flex items-center rounded-full border-4 overflow-hidden bg-white shadow-2xl backdrop-blur-sm"
              style={{ borderColor: '#021fdf' }}
            >
              <input
                type="text"
                placeholder="Search clubs..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-6 py-4 text-gray-800 bg-white focus:outline-none placeholder-gray-500 font-medium"
                style={{ fontSize: '16px' }} // Prevents zoom on iOS
              />
              <button
                onClick={handleSearch}
                className="px-6 py-4 mr-0.5 text-white font-black hover:opacity-90 transition-all duration-200 text-sm tracking-wide rounded-full"
                style={{ backgroundColor: '#021fdf' }}
              >
                SEARCH
              </button>
            </div>
          </div>

          {/* Filters Button - Enhanced styling */}
          <div className="flex justify-center">
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="flex items-center justify-center space-x-3 px-8 py-4 bg-white text-gray-800 rounded-full hover:bg-gray-50 transition-all duration-200 font-black shadow-2xl border-2 backdrop-blur-sm"
              style={{ borderColor: '#f0f0f0' }}
                        >
              <Filter className="h-5 w-5" style={{ color: '#021fdf' }} />
              <span className="tracking-wide text-lg" style={{ color: '#021fdf' }}>FILTERS</span>
              {activeFilterCount > 0 && (
                <span 
                  className="text-white text-xs font-bold rounded-full px-3 py-1"
                  style={{ backgroundColor: '#021fdf' }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Dialog */}
        <FilterDialog
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          filters={currentFilters}
          onFiltersChange={handleFiltersChange}
        />
      </>
    );
  }

  // Desktop navigation (existing design)
  return (
    <>
      <nav className="border-b border-blue-800 sticky top-0 z-40" style={{ backgroundColor: '#021fdf' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-black text-white">
                RUNHUB
              </span>
            </Link>

            {/* Search Bar - Using home page design */}
            <div className="flex-1 max-w-3xl mx-8 hidden md:block">
              <div className="relative">
                <div className="flex items-center rounded-full border-4 border-white overflow-hidden bg-white">
                  <input
                    type="text"
                    placeholder="Search by club name, location, or description..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-6 py-3 text-gray-600 bg-white focus:outline-none placeholder-gray-400"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-8 py-4 text-white font-black hover:opacity-90 transition-all duration-200 text-sm tracking-wide rounded-full"
                    style={{ backgroundColor: '#021fdf' }}
                  >
                    SEARCH
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Filters, Add Club, Menu */}
            <div className="flex items-center space-x-4">
              {/* Filters Button */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsFiltersOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium border"
                >
                  <Filter className="h-4 w-4" />
                  <span>FILTERS</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 ml-1">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

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
            <div className="absolute right-0 top-full w-64 bg-white border border-gray-200 rounded-lg shadow-lg" style={{ marginRight: '1rem' }}>
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
                  DIRECTORY
                </Link>
                <Link 
                  href="/about" 
                  className="text-gray-600 hover:bg-gray-50 font-medium px-4 py-3 transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.color = '#021fdf'}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  ABOUT
                </Link>
                <Link 
                  href="/contact" 
                  className="text-gray-600 hover:bg-gray-50 font-medium px-4 py-3 transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.color = '#021fdf'}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  CONTACT
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
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Filter Dialog */}
      <FilterDialog
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={currentFilters}
        onFiltersChange={handleFiltersChange}
      />
    </>
  );
} 