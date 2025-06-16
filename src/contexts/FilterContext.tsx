'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FilterState, RunClub } from '@/types';
import { sampleClubs } from '@/data/sampleClubs';

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  filteredClubs: RunClub[];
  resetFilters: () => void;
}

const initialFilters: FilterState = {
  searchQuery: '',
  states: [],
  meetingDays: [],
  timeOfDay: [],
  difficulty: [],
  distanceFocus: []
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const filteredClubs = React.useMemo(() => {
    return sampleClubs.filter(club => {
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

      // Difficulty filter
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(club.difficulty)) {
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
  }, [filters]);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <FilterContext.Provider value={{
      filters,
      setFilters,
      filteredClubs,
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