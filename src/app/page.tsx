'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Button from '@/components/Button';
import ClubCard from '@/components/ClubCard';
import Footer from '@/components/Footer';
import { getAllClubs } from '@/lib/supabase';
import { RunClub } from '@/types';
import { MapPin } from 'lucide-react';

export default function HomePage() {
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

  // Filter clubs based on search query for quick results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || clubs.length === 0) {
      return [];
    }
    
    return clubs.filter(club => 
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3); // Limit to 3 quick results for original design
  }, [searchQuery, clubs]);

  // Get featured clubs (first 6 clubs, sorted by name)
  const featuredClubs = useMemo(() => {
    return clubs.slice(0, 6);
  }, [clubs]);

  // Get newest clubs (last 6 clubs by created_at)
  const newClubs = useMemo(() => {
    const sortedByDate = [...clubs].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return sortedByDate.slice(0, 6);
  }, [clubs]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search page with query
      window.location.href = `/clubs?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
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
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-red-600 text-xl">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section - Matching the original design */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-12" style={{ color: '#021fdf' }}>
              FIND THE PERFECT RUN CLUB
            </h1>
            
            {/* Search Bar - Matching the exact original design */}
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
                      href={`/clubs/${club.slug}`}
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
          
          {featuredClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
              {featuredClubs.map(club => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          ) : (
            <div className="text-center text-white">
              <p className="text-xl">No clubs available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Run Clubs Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black mb-12 text-center" style={{ color: '#021fdf' }}>
            NEW RUN CLUBS
          </h2>
          
          {newClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
              {newClubs.map(club => (
                <ClubCard key={club.id} club={club} variant="light" />
              ))}
            </div>
          ) : (
            <div className="text-center" style={{ color: '#021fdf' }}>
              <p className="text-xl">No new clubs available at the moment.</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button href="/directory" variant="secondary" size="lg">
              <span className="inline-flex items-center">
                View All Clubs ({clubs.length})
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
