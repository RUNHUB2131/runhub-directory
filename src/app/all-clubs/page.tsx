'use client';

import { useState, useMemo, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import ClubCard from '@/components/ClubCard';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { getAllClubs } from '@/lib/supabase';
import { RunClub } from '@/types';
import { Search } from 'lucide-react';

export default function AllClubsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [clubs, setClubs] = useState<RunClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Filter clubs based on search query
  const filteredClubs = useMemo(() => {
    if (!searchQuery.trim()) {
      return clubs;
    }
    
    return clubs.filter(club => 
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.suburb.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, clubs]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#021fdf' }}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-white text-xl">Loading clubs...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#021fdf' }}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-white text-xl">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#021fdf' }}>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-8 text-white">
            ALL RUN CLUBS
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Browse all {clubs.length} run clubs across Australia and find your perfect running community
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search clubs by name, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-12 text-lg rounded-full border-4 border-white focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
              style={{ color: '#021fdf' }}
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6" style={{ color: '#021fdf' }} />
          </div>
        </div>

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