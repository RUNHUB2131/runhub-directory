'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RunClub } from '@/types';

interface MapComponentProps {
  clubs: RunClub[];
  onClubClick?: (club: RunClub) => void;
  height?: string;
}

export default function MapComponent({ 
  clubs, 
  onClubClick, 
  height = '400px' 
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedClub, setSelectedClub] = useState<RunClub | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Use placeholder token for demo - replace with actual token
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.demo';
    
    if (mapboxToken === 'pk.demo') {
      // Show placeholder message when no token is provided
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [133.7751, -25.2744], // Center of Australia
      zoom: 4
    });

    map.current.on('load', () => {
      setIsLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing markers properly
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each club
    clubs.forEach(club => {
      // Validate coordinates
      if (!club.coordinates || 
          typeof club.coordinates.lat !== 'number' || 
          typeof club.coordinates.lng !== 'number' ||
          isNaN(club.coordinates.lat) || 
          isNaN(club.coordinates.lng)) {
        console.warn(`Invalid coordinates for club ${club.name}:`, club.coordinates);
        return;
      }

      const el = document.createElement('div');
      el.className = 'club-marker';
      el.style.cssText = `
        background-color: #021fdf;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `;

      // Add subtle hover effect without transitions during map movement
      el.addEventListener('mouseenter', () => {
        el.style.backgroundColor = '#001bb8';
        el.style.borderColor = '#fbbf24';
        el.style.borderWidth = '3px';
        el.style.boxShadow = '0 4px 8px rgba(0,0,0,0.4)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.backgroundColor = '#021fdf';
        el.style.borderColor = 'white';
        el.style.borderWidth = '2px';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      });

      el.addEventListener('click', (e) => {
        // Get the pixel coordinates of the marker on screen
        const rect = mapContainer.current!.getBoundingClientRect();
        const markerRect = el.getBoundingClientRect();
        const x = markerRect.left - rect.left + markerRect.width / 2;
        const y = markerRect.top - rect.top;
        
        setSelectedClub(club);
        setPopupPosition({ x, y });
        if (onClubClick) {
          onClubClick(club);
        }
      });

      // Create marker with viewport alignment for better performance
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat([club.coordinates.lng, club.coordinates.lat])
        .addTo(map.current!);

      // Track marker for cleanup
      markersRef.current.push(marker);
    });

    // Fit map to show all clubs
    if (clubs.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      clubs.forEach(club => {
        if (club.coordinates && 
            typeof club.coordinates.lat === 'number' && 
            typeof club.coordinates.lng === 'number' &&
            !isNaN(club.coordinates.lat) && 
            !isNaN(club.coordinates.lng)) {
          bounds.extend([club.coordinates.lng, club.coordinates.lat]);
        }
      });
      
      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, { 
          padding: 50,
          maxZoom: 14
        });
      }
    }
  }, [clubs, isLoaded, onClubClick]);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.demo';

  if (mapboxToken === 'pk.demo') {
    return (
      <div 
        className="bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300"
        style={{ height }}
      >
        <div className="text-center p-8">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Map Integration</h3>
          <p className="text-gray-600 text-sm mb-4">
            To display the interactive map, please add your Mapbox token to the environment variables.
          </p>
          <div className="bg-gray-50 rounded p-3 text-left">
            <code className="text-sm text-gray-700">
              NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
            </code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        className="rounded-lg border border-gray-300"
        style={{ height }}
      />
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
        <div className="text-xs text-gray-600">
          {clubs.length} club{clubs.length !== 1 ? 's' : ''} shown
        </div>
      </div>


      {/* Small Club Info Popup */}
      {popupPosition && selectedClub && (
        <>
          {/* Invisible backdrop to close popup */}
          <div 
            className="absolute inset-0 z-30" 
            onClick={() => setPopupPosition(null)}
          />
          
          {/* Compact popup positioned near marker */}
          <div 
            className="absolute bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-40 w-64"
            style={{
              left: popupPosition.x + 25,
              top: popupPosition.y - 50,
              transform: popupPosition.x > 200 ? 'translateX(-100%)' : 'none'
            }}
          >
            {/* Arrow pointer */}
            <div 
              className="absolute w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"
              style={{
                left: popupPosition.x > 200 ? 'calc(100% - 20px)' : '15px',
                bottom: '-8px'
              }}
            />
            
            {/* Close button */}
            <button
              onClick={() => setPopupPosition(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Club name */}
            <h3 className="font-bold text-sm text-gray-900 mb-2 pr-6">{selectedClub.name}</h3>
            
            {/* Meeting info */}
            <div className="text-xs text-gray-600 mb-2">
              <div className="flex items-center mb-1">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{selectedClub.meeting_day}s at {selectedClub.meeting_time}</span>
              </div>
              <div className="flex items-center mb-2">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{selectedClub.suburb}, {selectedClub.state}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedClub.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                selectedClub.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {selectedClub.difficulty}
              </span>
              {selectedClub.distance_focus.slice(0, 2).map((distance) => (
                <span
                  key={distance}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                >
                  {distance}
                </span>
              ))}
            </div>

            {/* Action button */}
            <a
              href={`/clubs/${selectedClub.id}`}
              className="block w-full text-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
            >
              View Details
            </a>
          </div>
        </>
      )}
    </div>
  );
} 