'use client';

import React from 'react';
import { X, Filter } from 'lucide-react';

interface FilterState {
  states: string[];
  meetingDays: string[];
  clubType: string[];
  terrain: string[];
  extracurriculars: string[];
  isPaid: string[];
}

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const FILTER_OPTIONS = {
  states: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
  meetingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  clubType: ['everyone', 'women-only', 'men-only'],
  terrain: ['grass', 'hills', 'soft-sand', 'track', 'trail-running', 'urban'],
  extracurriculars: ['coaching', 'parkrun', 'post-run-coffee', 'post-run-drinks', 'post-run-meals', 'post-run-swim', 'social-events'],
  isPaid: ['free', 'paid']
};

export default function FilterDialog({ isOpen, onClose, filters, onFiltersChange }: FilterDialogProps) {
  if (!isOpen) return null;

  const getDisplayLabel = (option: string, category: keyof FilterState): string => {
    const labelMaps: Record<keyof FilterState, Record<string, string>> = {
      states: {},
      meetingDays: {
        'monday': 'Monday',
        'tuesday': 'Tuesday', 
        'wednesday': 'Wednesday',
        'thursday': 'Thursday',
        'friday': 'Friday',
        'saturday': 'Saturday',
        'sunday': 'Sunday'
      },
      clubType: {
        'everyone': 'Everyone',
        'women-only': 'Women Only',
        'men-only': 'Men Only'
      },
      terrain: {
        'grass': 'Grass',
        'hills': 'Hills',
        'soft-sand': 'Soft Sand',
        'track': 'Track',
        'trail-running': 'Trail Running',
        'urban': 'Urban'
      },
      extracurriculars: {
        'coaching': 'Coaching',
        'parkrun': 'Parkrun',
        'post-run-coffee': 'Post-Run Coffee',
        'post-run-drinks': 'Post-Run Drinks',
        'post-run-meals': 'Post-Run Meals',
        'post-run-swim': 'Post-Run Swim',
        'social-events': 'Social Events'
      },
      isPaid: {
        'free': 'Free',
        'paid': 'Paid'
      }
    };

    return labelMaps[category][option] || option;
  };

  const handleFilterChange = (category: keyof FilterState, value: string, isChecked: boolean) => {
    const currentValues = filters[category] as string[];
    let newValues: string[];

    if (isChecked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }

    const newFilters = { ...filters, [category]: newValues };
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterState = {
      states: [],
      meetingDays: [],
      clubType: [],
      terrain: [],
      extracurriculars: [],
      isPaid: []
    };
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

  const FilterSection = ({ 
    title, 
    options, 
    category, 
    selectedValues,
    columns = 1
  }: {
    title: string;
    options: string[];
    category: keyof FilterState;
    selectedValues: string[];
    columns?: number;
  }) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
        {title}
      </h3>
      <div className={`grid gap-2 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {options.map(option => (
          <label key={option} className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer">
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={(e) => handleFilterChange(category, option, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
            />
            <span className="text-sm text-gray-700">
              {getDisplayLabel(option, category)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Filter className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Filter Clubs</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-6">
              {/* Grid Layout for Better Organization */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Location & Timing */}
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-blue-900 mb-4">Location & Timing</h2>
                    
                    <FilterSection
                      title="State/Territory"
                      options={FILTER_OPTIONS.states}
                      category="states"
                      selectedValues={filters.states}
                      columns={2}
                    />

                    <FilterSection
                      title="Meeting Days"
                      options={FILTER_OPTIONS.meetingDays}
                      category="meetingDays"
                      selectedValues={filters.meetingDays}
                    />
                  </div>
                </div>

                {/* Club Characteristics */}
                <div className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-green-900 mb-4">Club Details</h2>
                    
                    <FilterSection
                      title="Club Type"
                      options={FILTER_OPTIONS.clubType}
                      category="clubType"
                      selectedValues={filters.clubType}
                    />

                    <FilterSection
                      title="Cost"
                      options={FILTER_OPTIONS.isPaid}
                      category="isPaid"
                      selectedValues={filters.isPaid}
                    />

                    <FilterSection
                      title="Terrain"
                      options={FILTER_OPTIONS.terrain}
                      category="terrain"
                      selectedValues={filters.terrain}
                    />
                  </div>
                </div>

                {/* Activities */}
                <div className="space-y-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-purple-900 mb-4">Activities</h2>
                    
                    <FilterSection
                      title="Extracurriculars"
                      options={FILTER_OPTIONS.extracurriculars}
                      category="extracurriculars"
                      selectedValues={filters.extracurriculars}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {hasActiveFilters ? (
                  <span>
                    {Object.values(filters).reduce((total, arr) => total + arr.length, 0)} filters active
                  </span>
                ) : (
                  <span>No filters applied</span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 