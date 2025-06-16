'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FilterState, RunClub } from '@/types';
import { getAllClubs } from '@/lib/supabase';

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  filteredClubs: RunClub[];
  allClubs: RunClub[];
  loading: boolean;
  error: string | null;
  resetFilters: () => void;
}

const initialFilters: FilterState = {
  searchQuery: '',
  states: [],
  meetingDays: [],
  timeOfDay: [],
  distanceFocus: []
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [allClubs, setAllClubs] = useState<RunClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load clubs from database on mount
  useEffect(() => {
    const loadClubs = async () => {
      try {
        setLoading(true);
        setError(null);
        const clubs = await getAllClubs();
        setAllClubs(clubs);
      } catch (err) {
        console.error('Error loading clubs in FilterContext:', err);
        setError('Failed to load clubs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadClubs();
  }, []);

  const filteredClubs = React.useMemo(() => {
    if (loading || allClubs.length === 0) {
      return [];
    }

    return allClubs.filter(club => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          club.name.toLowerCase().includes(query) ||
          club.description.toLowerCase().includes(query) ||
          club.location.toLowerCase().includes(query) ||
          club.suburb.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // State filter
      if (filters.states.length > 0 && !filters.states.includes(club.state)) {
        return false;
      }

      // Meeting day filter
      if (filters.meetingDays.length > 0 && !filters.meetingDays.includes(club.meeting_day)) {
        return false;
      }

      // Time of day filter
      if (filters.timeOfDay.length > 0 && !filters.timeOfDay.includes(club.time_of_day)) {
        return false;
      }



      // Distance focus filter
      if (filters.distanceFocus.length > 0) {
        const hasMatchingDistance = filters.distanceFocus.some(distance => 
          club.distance_focus.includes(distance)
        );
        if (!hasMatchingDistance) return false;
      }

      return true;
    });
  }, [filters, allClubs, loading]);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <FilterContext.Provider value={{
      filters,
      setFilters,
      filteredClubs,
      allClubs,
      loading,
      error,
      resetFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
} 