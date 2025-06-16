'use client';

import React from 'react';
import { useFilters } from '@/contexts/FilterContext';
import { Search, X, Filter } from 'lucide-react';

const STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
const MEETING_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_OF_DAY = ['morning', 'afternoon', 'evening'];
const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'];
const DISTANCE_FOCUS = ['5K', '10K', 'Half Marathon', 'Marathon', 'Mixed'];

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const { filters, setFilters, resetFilters, filteredClubs } = useFilters();

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, searchQuery: value });
  };

  const handleMultiSelectChange = (
    category: keyof typeof filters,
    value: string,
    isChecked: boolean
  ) => {
    const currentValues = filters[category] as string[];
    let newValues: string[];

    if (isChecked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }

    setFilters({ ...filters, [category]: newValues });
  };

  const CheckboxGroup = ({ 
    title, 
    options, 
    category, 
    selectedValues 
  }: {
    title: string;
    options: string[];
    category: keyof typeof filters;
    selectedValues: string[];
  }) => (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {options.map(option => (
          <label key={option} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={(e) => handleMultiSelectChange(category, option, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 capitalize">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:shadow-none lg:border-r lg:border-gray-200
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-full">
          <div className="hidden lg:block mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </h2>
          </div>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Clubs
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, location, or description..."
                value={filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">{filteredClubs.length}</span> clubs found
            </p>
          </div>

          {/* State Filter */}
          <CheckboxGroup
            title="State/Territory"
            options={STATES}
            category="states"
            selectedValues={filters.states}
          />

          {/* Meeting Day Filter */}
          <CheckboxGroup
            title="Meeting Day"
            options={MEETING_DAYS}
            category="meetingDays"
            selectedValues={filters.meetingDays}
          />

          {/* Time of Day Filter */}
          <CheckboxGroup
            title="Time of Day"
            options={TIME_OF_DAY}
            category="timeOfDay"
            selectedValues={filters.timeOfDay}
          />

          {/* Difficulty Filter */}
          <CheckboxGroup
            title="Difficulty Level"
            options={DIFFICULTY_LEVELS}
            category="difficulty"
            selectedValues={filters.difficulty}
          />

          {/* Distance Focus Filter */}
          <CheckboxGroup
            title="Distance Focus"
            options={DISTANCE_FOCUS}
            category="distanceFocus"
            selectedValues={filters.distanceFocus}
          />

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      </div>
    </>
  );
} 