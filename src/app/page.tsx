'use client';

import Link from 'next/link';
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ClubCard from '@/components/ClubCard';
import Button from '@/components/Button';
import Footer from '@/components/Footer';
import { sampleClubs } from '@/data/sampleClubs';
import { Search, MapPin, Users, Trophy, Plus } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get featured clubs (first 6 clubs)
  const featuredClubs = sampleClubs.slice(0, 6);
  
  // Get new clubs (next 3 clubs)
  const newClubs = sampleClubs.slice(6, 9);
  
  // Simple search for preview
  const searchResults = searchQuery.length > 2 
    ? sampleClubs.filter(club => 
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.state.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search page with query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section - Matching the provided design */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-12" style={{ color: '#021fdf' }}>
              FIND THE PERFECT RUN CLUB
            </h1>
            
            {/* Search Bar - Matching the exact design */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative">
                <div 
                  className="flex items-center rounded-full border-4 overflow-hidden"
                  style={{ borderColor: '#021fdf' }}
                >
                  <input
                    type="text"
                    placeholder="City, Town, Suburb"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-8 py-6 text-lg text-gray-600 bg-white focus:outline-none placeholder-gray-400"
                    style={{ backgroundColor: 'white' }}
                  />
                  <button
                    onClick={handleSearch}
                    className="px-12 py-6 text-white font-bold text-lg rounded-full hover:opacity-90 transition-colors"
                    style={{ backgroundColor: '#021fdf' }}
                  >
                    SEARCH
                  </button>
                </div>
              </div>
              
              {/* Search Results Preview */}
              {searchResults.length > 0 && (
                <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-left">
                  <h3 className="text-gray-900 font-semibold mb-2">Quick Results:</h3>
                  {searchResults.map(club => (
                    <Link
                      key={club.id}
                      href={`/clubs/${club.id}`}
                      className="block p-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <div className="text-gray-900 font-medium">{club.name}</div>
                      <div className="text-gray-600 text-sm">{club.location}</div>
                    </Link>
                  ))}
                  <Link
                    href="/directory"
                    className="block mt-2 text-sm font-medium hover:opacity-80 transition-colors"
                    style={{ color: '#021fdf' }}
                  >
                    View all results →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Run Clubs Section */}
      <div className="py-16" style={{ backgroundColor: '#021fdf' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black mb-12 text-center text-white">
            FEATURED RUN CLUBS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {featuredClubs.map(club => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        </div>
      </div>

      {/* New Run Clubs Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black mb-12 text-center" style={{ color: '#021fdf' }}>
            NEW RUN CLUBS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {newClubs.map(club => (
              <ClubCard key={club.id} club={club} variant="light" />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button href="/all-clubs" variant="secondary" size="lg">
              <span className="inline-flex items-center">
                View All Clubs
                <MapPin className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </div>
        </div>
      </div>


      <Footer />
    </div>
  );
}
