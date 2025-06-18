'use client';

import { useState, useMemo, useEffect } from 'react';
import SearchNavigation from '@/components/SearchNavigation';
import SearchClubCard from '@/components/SearchClubCard';
import MapComponent from '@/components/MapComponent';
import Button from '@/components/Button';
import Footer from '@/components/Footer';
import { getAllClubs } from '@/lib/supabase';
import { RunClub } from '@/types';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Navigation from '@/components/Navigation';

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

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [clubs, setClubs] = useState<RunClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapBounds, setMapBounds] = useState<{ north: number; south: number; east: number; west: number } | null>(null);
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

  // Helper function to check if a club is within the visible map bounds
  const isClubInBounds = (club: RunClub): boolean => {
    if (!mapBounds || !club.coordinates) return true; // Show all clubs if no bounds or coordinates
    
    const { lat, lng } = club.coordinates;
    return (
      lat <= mapBounds.north &&
      lat >= mapBounds.south &&
      lng <= mapBounds.east &&
      lng >= mapBounds.west
    );
  };

  // Filter clubs based on search and filters
  const filteredClubs = useMemo(() => {
    return clubs.filter(club => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.suburb.toLowerCase().includes(searchQuery.toLowerCase());

      // State filter
      const matchesState = filters.states.length === 0 || filters.states.includes(club.state);

      // Meeting day filter
      const matchesMeetingDay = filters.meetingDays.length === 0 || 
        (club.run_days && club.run_days.some((day: string) => filters.meetingDays.includes(day)));

      // Extracurriculars filter
      const matchesExtracurriculars = filters.extracurriculars.length === 0 || 
        (club.extracurriculars && club.extracurriculars.some((activity: string) => filters.extracurriculars.includes(activity)));

      // Club type filter
      const matchesClubType = filters.clubType.length === 0 || 
        (club.club_type && filters.clubType.includes(club.club_type));

      // Terrain filter
      const matchesTerrain = filters.terrain.length === 0 || 
        (club.terrain && club.terrain.some(terrain => filters.terrain.includes(terrain)));

      // Cost filter
      const matchesCost = filters.isPaid.length === 0 || 
        (club.is_paid && filters.isPaid.includes(club.is_paid));

      // Map bounds filter
      const isInBounds = isClubInBounds(club);

      return matchesSearch && matchesState && matchesMeetingDay && matchesExtracurriculars && 
             matchesClubType && matchesTerrain && matchesCost && isInBounds;
    });
      }, [searchQuery, filters, clubs, mapBounds]);

  // Paginate results
  const paginatedClubs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClubs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClubs, currentPage]);

  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage);

  const handleMapClubClick = (club: RunClub) => {
    setSelectedClubId(club.id);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleMapBoundsChange = (bounds: { north: number; south: number; east: number; west: number } | null) => {
    setMapBounds(bounds);
    setCurrentPage(1); // Reset to first page when map view changes
  };

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SearchNavigation 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery}
          onFiltersChange={handleFiltersChange}
          currentFilters={filters}
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-gray-600 text-xl">Loading clubs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SearchNavigation 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery}
          onFiltersChange={handleFiltersChange}
          currentFilters={filters}
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-red-600 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <SearchNavigation 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery}
          onFiltersChange={handleFiltersChange}
          currentFilters={filters}
        />
      </div>
      
      {/* Mobile Normal Header */}
      <div className="md:hidden">
        <Navigation />
      </div>
      
      {/* Mobile Floating Search/Filters */}
      <div className="md:hidden">
        <SearchNavigation 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery}
          onFiltersChange={handleFiltersChange}
          currentFilters={filters}
          isMobileMapView={true}
        />
      </div>
      
      {/* Main Layout */}
      <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-80px)]">
        {/* Left Side - Club List (Desktop only) */}
        <div className="hidden md:flex md:w-1/2 flex-col">
          {/* Results Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredClubs.length} clubs found
              </h2>
              {searchQuery && (
                <p className="text-sm text-gray-600 mt-1">
                  Showing results for &quot;{searchQuery}&quot;
                </p>
              )}
            </div>
          </div>

          {/* Club List Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable Club List */}
            <div className="flex-1 overflow-y-auto p-4">
              {paginatedClubs.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {paginatedClubs.map(club => (
                    <SearchClubCard
                      key={club.id}
                      club={club}
                      isHighlighted={selectedClubId === club.id}
                      onClick={() => handleMapClubClick(club)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Search className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No clubs found</h3>
                  <p className="text-gray-600 text-center">
                    Try adjusting your search terms or filters to find more clubs.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200 bg-white px-4 py-3">
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    variant="secondary"
                    size="sm"
                    className="w-26 flex items-center justify-center"
                  >
                    <ChevronLeft className="h-4 w-4 ml-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    variant="secondary"
                    size="sm"
                    className="w-26 flex items-center justify-center"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Map (Full width on mobile, 50% on desktop) */}
        <div className="w-full md:w-1/2 h-full">
          <div className="h-full relative">
            <MapComponent 
              clubs={filteredClubs} 
              onClubClick={handleMapClubClick}
              onBoundsChange={handleMapBoundsChange}
              height="100%"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 