'use client';

import { useState, useMemo, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import SearchClubCard from '@/components/SearchClubCard';
import MapComponent from '@/components/MapComponent';
import Button from '@/components/Button';
import Footer from '@/components/Footer';
import { getAllClubs } from '@/lib/supabase';
import { RunClub } from '@/types';
import { MapPin, Search } from 'lucide-react';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [clubs, setClubs] = useState<RunClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 15;

  // Load clubs on component mount
  useEffect(() => {
    const loadClubs = async () => {
      try {
        setLoading(true);
        const fetchedClubs = await getAllClubs();
        setClubs(fetchedClubs);
        setError(null);
      } catch (err) {
        console.error('Error loading clubs:', err);
        setError('Failed to load clubs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadClubs();
  }, []);

  // Get unique states from clubs
  const states = useMemo(() => {
    const uniqueStates = [...new Set(clubs.map(club => club.state))];
    return uniqueStates.sort();
  }, [clubs]);

  // Filter clubs based on search and filters
  const filteredClubs = useMemo(() => {
    return clubs.filter(club => {
      const matchesSearch = searchQuery === '' || 
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.suburb.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState = stateFilter === 'all' || club.state === stateFilter;
      const matchesDifficulty = difficultyFilter === 'all' || club.difficulty === difficultyFilter;
      const matchesTime = timeFilter === 'all' || club.time_of_day === timeFilter;

      return matchesSearch && matchesState && matchesDifficulty && matchesTime;
    });
  }, [searchQuery, stateFilter, difficultyFilter, timeFilter, clubs]);

  // Paginate results
  const paginatedClubs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClubs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClubs, currentPage]);

  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage);

  const handleMapClubClick = (club: RunClub) => {
    setSelectedClubId(club.id);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStateFilter('all');
    setDifficultyFilter('all');
    setTimeFilter('all');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-gray-600 text-xl">Loading clubs...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-red-600 text-xl">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-4" style={{ color: '#021fdf' }}>
            SEARCH RUN CLUBS
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Find your perfect running community from {clubs.length} clubs across Australia
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search by club name, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-4"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="all-levels">All Levels</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time of Day</label>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Any Time</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button onClick={clearFilters} variant="secondary" size="sm">
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Club List */}
          <div>
            <div className="mb-4">
              <p className="text-gray-600">
                Showing {paginatedClubs.length} of {filteredClubs.length} clubs
              </p>
            </div>

            {paginatedClubs.length > 0 ? (
              <div className="space-y-4">
                {paginatedClubs.map(club => (
                  <SearchClubCard
                    key={club.id}
                    club={club}
                    isHighlighted={selectedClubId === club.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No clubs found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button onClick={clearFilters} variant="primary">
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg border ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="sticky top-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Club Locations</h3>
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <MapComponent
                clubs={filteredClubs}
                onClubClick={handleMapClubClick}
                height="600px"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 