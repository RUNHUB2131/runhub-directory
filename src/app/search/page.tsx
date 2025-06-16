'use client';

import { useState, useMemo } from 'react';
import SearchNavigation from '@/components/SearchNavigation';
import SearchClubCard from '@/components/SearchClubCard';
import MapComponent from '@/components/MapComponent';
import Button from '@/components/Button';
import Footer from '@/components/Footer';
import { sampleClubs } from '@/data/sampleClubs';
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
  const itemsPerPage = 15;

  // Get unique states from clubs
  const states = useMemo(() => {
    const uniqueStates = [...new Set(sampleClubs.map(club => club.state))];
    return uniqueStates.sort();
  }, []);

  // Filter clubs based on search and filters
  const filteredClubs = useMemo(() => {
    return sampleClubs.filter(club => {
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
  }, [searchQuery, stateFilter, difficultyFilter, timeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClubs = filteredClubs.slice(startIndex, startIndex + itemsPerPage);

  const clearFilters = () => {
    setSearchQuery('');
    setStateFilter('all');
    setDifficultyFilter('all');
    setTimeFilter('all');
    setCurrentPage(1);
    setSelectedClubId(null);
  };

  const hasActiveFilters = searchQuery || stateFilter !== 'all' || difficultyFilter !== 'all' || timeFilter !== 'all';

  // Handle map pin click
  const handleMapClubClick = (club: RunClub) => {
    setSelectedClubId(club.id);
    
    // Find the page that contains this club
    const clubIndex = filteredClubs.findIndex(c => c.id === club.id);
    if (clubIndex !== -1) {
      const pageNumber = Math.floor(clubIndex / itemsPerPage) + 1;
      setCurrentPage(pageNumber);
    }
  };

  // Enhanced SearchClubCard component with highlighting
  const EnhancedClubCard = ({ club }: { club: RunClub }) => {
    const isSelected = selectedClubId === club.id;
    return (
      <div 
        className={`transition-all duration-300 ${isSelected ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}`}
        onClick={() => setSelectedClubId(club.id)}
      >
        <SearchClubCard club={club} isHighlighted={isSelected} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <SearchNavigation 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
      />

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Territory
                </label>
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                >
                  <option value="all">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time of Day
                </label>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                >
                  <option value="all">Any Time</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1" style={{ backgroundColor: '#021fdf' }}>
        <div className="flex" style={{ height: showFilters ? 'calc(100vh - 160px)' : 'calc(100vh - 64px)' }}>
          {/* Left Side - Club Cards */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedClubs.map(club => (
                <EnhancedClubCard key={club.id} club={club} />
              ))}
            </div>
            
            {/* No Results Message */}
            {filteredClubs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-white mb-4">
                  <Search className="h-12 w-12 mx-auto opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  No clubs found
                </h3>
                <p className="text-blue-200 mb-4">
                  Try adjusting your search criteria or clearing filters
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters} variant="primary" size="md">
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 pb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">
                    {currentPage} / {totalPages}
                  </span>
                  <div className="flex space-x-1">
                    {currentPage > 1 && (
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center hover:opacity-90 transition-colors"
                      >
                        ←
                      </button>
                    )}
                    {currentPage < totalPages && (
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center hover:opacity-90 transition-colors"
                      >
                        →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Map */}
          <div className="w-1/2 relative">
            <div className="sticky top-0" style={{ height: showFilters ? 'calc(100vh - 160px)' : 'calc(100vh - 64px)' }}>
              <MapComponent 
                clubs={filteredClubs}
                onClubClick={handleMapClubClick}
                height={showFilters ? 'calc(100vh - 160px)' : 'calc(100vh - 64px)'}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 