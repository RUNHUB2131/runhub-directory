'use client';

import Link from 'next/link';
import { RunClub } from '@/types';
import { MapPin, Clock, Users } from 'lucide-react';

interface SearchClubCardProps {
  club: RunClub;
  isHighlighted?: boolean;
}

export default function SearchClubCard({ club, isHighlighted = false }: SearchClubCardProps) {
  // Helper function to get meeting day from schedule
  const getMeetingDay = () => {
    const schedule = club.meeting_day.toLowerCase();
    const dayMap: { [key: string]: string } = {
      'monday': 'Mon',
      'tuesday': 'Tue', 
      'wednesday': 'Wed',
      'thursday': 'Thu',
      'friday': 'Fri',
      'saturday': 'Sat',
      'sunday': 'Sun'
    };
    
    for (const [day, abbr] of Object.entries(dayMap)) {
      if (schedule.includes(day)) {
        return abbr;
      }
    }
    return 'Mon'; // Default
  };

  // Helper function to get terrain tags from description
  const getTerrainTags = () => {
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

  const meetingDay = getMeetingDay();
  const terrainTags = getTerrainTags();

  // Use club photo if available, otherwise fallback to placeholder
  const clubImage = club.club_photo || `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=160&fit=crop&crop=center`;

  return (
    <Link href={`/clubs/${club.id}`} className="block">
      <div className={`rounded-xl border hover:shadow-lg transition-all duration-200 ${
        isHighlighted 
          ? 'border-blue-500 shadow-md bg-blue-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}>
        <div className="p-3">
          {/* Club Photo - Smaller and more compact */}
          <div className="mb-3">
            <img
              src={clubImage}
              alt={`${club.name} group photo`}
              className="w-full h-20 object-cover rounded-lg"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.src = `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=160&fit=crop&crop=center`;
              }}
            />
          </div>

          {/* Club Name - More compact */}
          <h3 className="text-sm font-bold mb-2 line-clamp-1" style={{ color: '#021fdf' }}>
            {club.name}
          </h3>

          {/* Location - Inline with icon */}
          <div className="flex items-center mb-2" style={{ color: '#021fdf' }}>
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="text-xs font-medium truncate">{club.suburb}, {club.state}</span>
          </div>

          {/* Meeting Info - Compact horizontal layout */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center" style={{ color: '#021fdf' }}>
              <Clock className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">{meetingDay}</span>
            </div>
            <div className="flex items-center" style={{ color: '#021fdf' }}>
              <span className="text-xs">{club.meeting_time}</span>
            </div>
          </div>

          {/* Description - Very condensed */}
          <p className="text-xs leading-relaxed mb-2 text-gray-600 line-clamp-2">
            {club.description.length > 60 
              ? `${club.description.substring(0, 60)}...`
              : club.description
            }
          </p>

          {/* Terrain Tag and Difficulty - Horizontal layout */}
          <div className="flex items-center justify-between">
            <span
              className="px-2 py-1 text-white font-bold text-xs rounded-full"
              style={{ backgroundColor: '#021fdf' }}
            >
              {terrainTags[0]}
            </span>
            <span className="text-xs font-medium" style={{ color: '#021fdf' }}>
              {club.difficulty}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 