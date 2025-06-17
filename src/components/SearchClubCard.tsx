'use client';

import Link from 'next/link';
import { RunClub } from '@/types';
import { MapPin } from 'lucide-react';

interface SearchClubCardProps {
  club: RunClub;
  isHighlighted?: boolean;
  onClick?: () => void;
}

// Separate client component for image with error handling
function SearchClubImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=160&fit=crop&crop=center`;
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleImageError}
    />
  );
}

export default function SearchClubCard({ club, isHighlighted = false, onClick }: SearchClubCardProps) {
  // Helper function to get all meeting days from run_days
  const getMeetingDays = (): string[] => {
    // Use run_days array directly (preferred method)
    if (club.run_days && club.run_days.length > 0) {
      return club.run_days.map(day => day.toLowerCase());
    }
    
    // Fallback: try to extract from meeting_day (legacy)
    const schedule = club.meeting_day.toLowerCase();
    const dayMap: { [key: string]: string } = {
      'monday': 'monday',
      'tuesday': 'tuesday', 
      'wednesday': 'wednesday',
      'thursday': 'thursday',
      'friday': 'friday',
      'saturday': 'saturday',
      'sunday': 'sunday'
    };
    
    for (const [day, value] of Object.entries(dayMap)) {
      if (schedule.includes(day)) {
        return [value];
      }
    }
    return []; // No days found
  };

  // Helper function to convert day name to abbreviation
  const getDayAbbreviation = (day: string): string => {
    const dayMap: { [key: string]: string } = {
      'monday': 'Mo',
      'tuesday': 'Tu', 
      'wednesday': 'We',
      'thursday': 'Th',
      'friday': 'Fr',
      'saturday': 'Sa',
      'sunday': 'Su'
    };
    return dayMap[day.toLowerCase()] || '';
  };

  // Use actual terrain data from database
  const getTerrainTags = () => {
    if (club.terrain && club.terrain.length > 0) {
      // Use actual terrain data, limit to 1 tag for compact view and uppercase it
      return [club.terrain[0].toUpperCase()];
    }
    
    // Fallback: extract from description if no terrain data
    const desc = club.description.toLowerCase();
    const tags = [];
    
    if (desc.includes('grass') || desc.includes('park')) tags.push('GRASS');
    if (desc.includes('hill') || desc.includes('trail') || desc.includes('mountain')) tags.push('HILLS');
    if (desc.includes('beach') || desc.includes('sand')) tags.push('SAND');
    if (desc.includes('track') || desc.includes('athletics')) tags.push('TRACK');
    if (desc.includes('trail') || desc.includes('bush')) tags.push('TRAIL');
    if (desc.includes('street') || desc.includes('city') || desc.includes('urban') || desc.includes('road')) tags.push('URBAN');
    
    return tags.length > 0 ? tags.slice(0, 1) : ['URBAN']; // Limit to 1 tag for condensed view
  };

  const meetingDays = getMeetingDays();
  const terrainTags = getTerrainTags();
  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  
  // Create a set of active day abbreviations for easy lookup
  const activeDayAbbrs = new Set(meetingDays.map(day => getDayAbbreviation(day)));

  // Use club photo if available, otherwise fallback to placeholder
  const clubImage = club.club_photo || `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=160&fit=crop&crop=center`;

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
    // Allow Link navigation to proceed
  };

  return (
    <Link href={`/clubs/${club.id}`} className="block" onClick={handleClick}>
      <div 
        className={`rounded-xl border-2 p-2 hover:scale-105 transition-transform duration-200 ${
          isHighlighted 
            ? 'border-blue-500 shadow-md' 
            : 'border-gray-200 hover:border-blue-300'
        }`}
      >
        <div className="bg-white rounded-lg p-3">
          {/* Club Photo - Compact */}
          <div className="mb-3">
            <SearchClubImage
              src={clubImage}
              alt={`${club.name} group photo`}
              className="w-full h-20 object-cover rounded-lg"
            />
          </div>

          {/* Club Name - Compact */}
          <h3 className="text-sm font-black mb-2 uppercase line-clamp-1" style={{ color: '#021fdf' }}>
            {club.name}
          </h3>

          {/* Location - Compact */}
          <div className="flex items-center mb-3" style={{ color: '#021fdf' }}>
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="text-xs font-semibold truncate">{club.suburb}, {club.state}</span>
          </div>

          {/* Days of Week - Compact version */}
          <div className="mb-3">
            <div className="flex justify-center space-x-1">
              {daysOfWeek.map(day => (
                <div
                  key={day}
                  className={`w-5 h-5 rounded-sm flex items-center justify-center text-xs font-bold ${
                    activeDayAbbrs.has(day)
                      ? 'text-white' 
                      : 'text-gray-400'
                  }`}
                  style={activeDayAbbrs.has(day) ? { backgroundColor: '#021fdf' } : { backgroundColor: '#f0f0f0' }}
                >
                  {day.charAt(0)} {/* Just first letter for very compact view */}
                </div>
              ))}
            </div>
          </div>

          {/* Description - Very condensed */}
          <p className="text-xs leading-relaxed mb-3 text-gray-600 line-clamp-2" style={{ color: '#021fdf' }}>
            {club.description.length > 60 
              ? `${club.description.substring(0, 60)}...`
              : club.description
            }
          </p>

          {/* Terrain Tag */}
          <div className="flex items-center">
            <span
              className="px-2 py-1 text-white font-bold text-xs rounded-full"
              style={{ backgroundColor: '#021fdf' }}
            >
              {terrainTags[0]}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 