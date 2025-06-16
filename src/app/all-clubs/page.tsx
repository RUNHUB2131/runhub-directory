'use client';

import { useState, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import ClubCard from '@/components/ClubCard';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { sampleClubs } from '@/data/sampleClubs';
import { Search } from 'lucide-react';

export default function AllClubsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter clubs based on search query
  const filteredClubs = useMemo(() => {
    if (!searchQuery.trim()) {
      return sampleClubs;
    }
    
    return sampleClubs.filter(club => 
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.suburb.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#021fdf' }}>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            RUNNING CLUB DIRECTORY
          </h1>
          <p className="text-blue-200 text-xl max-w-2xl mx-auto leading-relaxed">
            Find your perfect running community from clubs across Australia
          </p>
        </div>

        {/* Search Bar - Using existing homepage search pattern */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            <div 
              className="flex items-center rounded-full border-4 overflow-hidden bg-white"
              style={{ borderColor: 'white' }}
            >
              <div className="flex items-center flex-1 px-8">
                <Search className="h-6 w-6 text-gray-400 mr-4" />
                <input
                  type="text"
                  placeholder="Search clubs by name, location, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 py-6 text-lg text-gray-700 bg-transparent focus:outline-none placeholder-gray-400"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="px-8 py-6 text-white font-bold text-lg rounded-full hover:opacity-90 transition-colors"
                  style={{ backgroundColor: '#021fdf' }}
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-10">
          <p className="text-white text-xl font-semibold">
            {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Club Cards Grid */}
        {filteredClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {filteredClubs.map(club => (
              <ClubCard key={club.id} club={club} variant="dark" />
            ))}
          </div>
        ) : (
          /* No Results */
          <div className="text-center py-20">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-12 max-w-lg mx-auto">
              <Search className="h-20 w-20 text-white mx-auto mb-6 opacity-60" />
              <h3 className="text-2xl font-bold text-white mb-4">
                No clubs found
              </h3>
              <p className="text-blue-200 text-lg mb-8 leading-relaxed">
                Try adjusting your search terms or clearing your search to browse all clubs
              </p>
              <Button onClick={handleClearSearch} variant="primary" size="lg">
                CLEAR SEARCH
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
} 