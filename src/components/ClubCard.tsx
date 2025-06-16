'use client';

import Link from 'next/link';
import { RunClub } from '@/types';
import { MapPin } from 'lucide-react';

interface ClubCardProps {
  club: RunClub;
  variant?: 'dark' | 'light'; // dark for blue backgrounds, light for white backgrounds
}

export default function ClubCard({ club, variant = 'dark' }: ClubCardProps) {
  // Helper function to get meeting day from schedule
  const getMeetingDay = () => {
    const schedule = club.meeting_day.toLowerCase();
    const dayMap: { [key: string]: string } = {
      'monday': 'Mo',
      'tuesday': 'Tu', 
      'wednesday': 'We',
      'thursday': 'Th',
      'friday': 'Fr',
      'saturday': 'Sa',
      'sunday': 'Su'
    };
    
    for (const [day, abbr] of Object.entries(dayMap)) {
      if (schedule.includes(day)) {
        return abbr;
      }
    }
    return 'Mo'; // Default
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
    
    return tags.length > 0 ? tags.slice(0, 2) : ['URBAN']; // Default to Urban, limit to 2
  };

  const meetingDay = getMeetingDay();
  const terrainTags = getTerrainTags();
  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // Use club photo if available, otherwise fallback to placeholder
  const clubImage = club.club_photo || `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&crop=center`;

  // Border color based on variant
  const borderColor = variant === 'light' ? '#021fdf' : 'white';

  return (
    <Link href={`/clubs/${club.id}`} className="block">
      <div 
        className="rounded-3xl border-2 p-2 hover:scale-105 transition-transform duration-200 h-full"
        style={{ borderColor }}
      >
        <div className="bg-white rounded-2xl p-4 cursor-pointer h-full flex flex-col">
          {/* Club Photo */}
          <div className="mb-4">
            <img
              src={clubImage}
              alt={`${club.name} group photo`}
              className="w-full h-32 object-cover rounded-xl"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.src = `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&crop=center`;
              }}
            />
          </div>

          {/* Club Name - Fixed height */}
          <h3 className="text-lg font-black mb-2 uppercase h-12 flex items-center" style={{ color: '#021fdf' }}>
            {club.name}
          </h3>

          {/* Location - Fixed height */}
          <div className="flex items-center mb-4 h-6" style={{ color: '#021fdf' }}>
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm font-semibold">{club.suburb}, {club.state}</span>
          </div>

          {/* Weekly Schedule - Fixed height */}
          <div className="mb-4 h-8">
            <div className="flex justify-center space-x-1">
              {daysOfWeek.map(day => (
                <div
                  key={day}
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                    day === meetingDay 
                      ? 'text-white' 
                      : 'text-gray-400'
                  }`}
                  style={day === meetingDay ? { backgroundColor: '#021fdf' } : { backgroundColor: '#f0f0f0' }}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Description - Fixed height with flex-grow */}
          <div className="flex-grow mb-4">
            <p className="text-sm leading-relaxed h-16 overflow-hidden" style={{ color: '#021fdf' }}>
              {club.description.length > 80 
                ? `${club.description.substring(0, 80)}... MORE`
                : club.description
              }
            </p>
          </div>

          {/* Terrain Tags - Fixed height at bottom */}
          <div className="flex flex-wrap gap-2 h-8 items-start">
            {terrainTags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 text-white font-bold text-xs rounded-full"
                style={{ backgroundColor: '#021fdf' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
} 