'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RunClub } from '@/types';

interface MapComponentProps {
  clubs: RunClub[];
  onClubClick?: (club: RunClub) => void;
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number } | null) => void;
  height?: string;
}

export default function MapComponent({ 
  clubs, 
  onClubClick, 
  onBoundsChange,
  height = '400px' 
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedClub, setSelectedClub] = useState<RunClub | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const hasInitiallyFitBounds = useRef(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Use placeholder token for demo - replace with actual token
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.demo';
    
    if (mapboxToken === 'pk.demo') {
      // Show placeholder message when no token is provided
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [133.7751, -25.2744], // Center of Australia
        zoom: 4,
        attributionControl: true,
        preserveDrawingBuffer: true,
        antialias: true
      });

      map.current.on('load', () => {
        setIsLoaded(true);
        
        // Trigger resize to ensure map fits container properly
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
          }
        }, 100);
      });

      // Track map bounds changes
      const updateBounds = () => {
        if (map.current && onBoundsChange) {
          const bounds = map.current.getBounds();
          if (bounds) {
            onBoundsChange({
              north: bounds.getNorth(),
              south: bounds.getSouth(),
              east: bounds.getEast(),
              west: bounds.getWest()
            });
          }
        }
      };

      // Listen for map movement events
      map.current.on('moveend', updateBounds);
      map.current.on('zoomend', updateBounds);

      map.current.on('error', (e) => {
        console.error('MapComponent: Map error:', e);
      });

      // Add resize handler to ensure map fits properly
      map.current.on('resize', () => {
        // Map resized
      });

      map.current.on('styledata', () => {
        // Style data loaded
      });

      map.current.on('sourcedata', () => {
        // Source data loaded
      });

      map.current.on('idle', () => {
        // Map is idle (fully loaded)
      });

    } catch (error) {
      console.error('MapComponent: Error creating map:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Track if we're currently interacting with the map
  const isInteracting = useRef(false);
  const interactionTimeout = useRef<NodeJS.Timeout | null>(null);

  // Add interaction tracking
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    const handleInteractionStart = () => {
      isInteracting.current = true;
      if (interactionTimeout.current) {
        clearTimeout(interactionTimeout.current);
      }
    };

    const handleInteractionEnd = () => {
      // Wait a bit after interaction ends before allowing marker updates
      if (interactionTimeout.current) {
        clearTimeout(interactionTimeout.current);
      }
      interactionTimeout.current = setTimeout(() => {
        isInteracting.current = false;
        // Force a re-render to update markers after interaction ends
        setIsLoaded(prev => prev);
      }, 100);
    };

    // Add event listeners for various interaction types
    map.current.on('dragstart', handleInteractionStart);
    map.current.on('dragend', handleInteractionEnd);
    map.current.on('zoomstart', handleInteractionStart);
    map.current.on('zoomend', handleInteractionEnd);
    map.current.on('rotatestart', handleInteractionStart);
    map.current.on('rotateend', handleInteractionEnd);

    return () => {
      if (map.current) {
        map.current.off('dragstart', handleInteractionStart);
        map.current.off('dragend', handleInteractionEnd);
        map.current.off('zoomstart', handleInteractionStart);
        map.current.off('zoomend', handleInteractionEnd);
        map.current.off('rotatestart', handleInteractionStart);
        map.current.off('rotateend', handleInteractionEnd);
      }
      if (interactionTimeout.current) {
        clearTimeout(interactionTimeout.current);
      }
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Don't update markers during active interaction
    if (isInteracting.current) {
      return;
    }

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

      el.addEventListener('click', () => {
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

    // Only fit bounds on initial load, not during filtering
    if (clubs.length > 0 && !hasInitiallyFitBounds.current) {
      hasInitiallyFitBounds.current = true;
      const bounds = new mapboxgl.LngLatBounds();
      let validClubsCount = 0;
      
      clubs.forEach(club => {
        if (club.coordinates && 
            typeof club.coordinates.lat === 'number' && 
            typeof club.coordinates.lng === 'number' &&
            !isNaN(club.coordinates.lat) && 
            !isNaN(club.coordinates.lng)) {
          bounds.extend([club.coordinates.lng, club.coordinates.lat]);
          validClubsCount++;
        }
      });
      
      if (!bounds.isEmpty() && validClubsCount > 0) {
        // Add a small delay to ensure map container is properly sized
        setTimeout(() => {
          try {
            if (map.current) {
              map.current.fitBounds(bounds, { 
                padding: 50,
                maxZoom: 14,
                duration: 1000
              });
              
              // Update bounds after fitting
              setTimeout(() => {
                if (map.current && onBoundsChange) {
                  const currentBounds = map.current.getBounds();
                  if (currentBounds) {
                    onBoundsChange({
                      north: currentBounds.getNorth(),
                      south: currentBounds.getSouth(),
                      east: currentBounds.getEast(),
                      west: currentBounds.getWest()
                    });
                  }
                }
              }, 1100);
            }
          } catch (boundsError) {
            console.warn('MapComponent: Error fitting bounds, using fallback center:', boundsError);
            // Fallback to center of Australia if bounds fitting fails
            if (map.current) {
              map.current.setCenter([133.7751, -25.2744]);
              map.current.setZoom(5);
            }
          }
        }, 500);
      } else {
        console.warn('MapComponent: No valid bounds to fit');
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
    <div style={{ height, width: '100%', position: 'relative' }}>
      <div
        ref={mapContainer}
        style={{ 
          width: '100%',
          height: '100%',
          minHeight: height === '100%' ? '400px' : undefined
        }}
      />


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
            className="absolute bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 z-40 w-72"
            style={{
              left: popupPosition.x + 25,
              top: popupPosition.y - 80,
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
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Club Image */}
            <div className="mb-3">
              <img
                src={selectedClub.club_photo || `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=120&fit=crop&crop=center`}
                alt={`${selectedClub.name} group photo`}
                className="w-full h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=120&fit=crop&crop=center`;
                }}
              />
            </div>

            {/* Club name */}
            <h3 className="font-black text-sm uppercase mb-2 pr-6" style={{ color: '#021fdf' }}>
              {selectedClub.name}
            </h3>
            
            {/* Location */}
            <div className="flex items-center mb-3" style={{ color: '#021fdf' }}>
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-semibold">{selectedClub.suburb}, {selectedClub.state}</span>
            </div>

            {/* Days of Week - Same as SearchClubCard */}
            <div className="mb-3">
              <div className="flex justify-center space-x-1">
                {(() => {
                  // Helper functions (same as SearchClubCard)
                  const getMeetingDays = (): string[] => {
                    if (selectedClub.run_days && selectedClub.run_days.length > 0) {
                      return selectedClub.run_days.map(day => day.toLowerCase());
                    }
                    
                    const schedule = selectedClub.meeting_day.toLowerCase();
                    const dayMap: { [key: string]: string } = {
                      'monday': 'monday', 'tuesday': 'tuesday', 'wednesday': 'wednesday',
                      'thursday': 'thursday', 'friday': 'friday', 'saturday': 'saturday', 'sunday': 'sunday'
                    };
                    
                    for (const [day, value] of Object.entries(dayMap)) {
                      if (schedule.includes(day)) {
                        return [value];
                      }
                    }
                    return [];
                  };

                  const getDayAbbreviation = (day: string): string => {
                    const dayMap: { [key: string]: string } = {
                      'monday': 'Mo', 'tuesday': 'Tu', 'wednesday': 'We',
                      'thursday': 'Th', 'friday': 'Fr', 'saturday': 'Sa', 'sunday': 'Su'
                    };
                    return dayMap[day.toLowerCase()] || '';
                  };

                  const meetingDays = getMeetingDays();
                  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
                  const activeDayAbbrs = new Set(meetingDays.map(day => getDayAbbreviation(day)));

                  return daysOfWeek.map(day => (
                    <div
                      key={day}
                      className={`w-5 h-5 rounded-sm flex items-center justify-center text-xs font-bold ${
                        activeDayAbbrs.has(day) ? 'text-white' : 'text-gray-400'
                      }`}
                      style={activeDayAbbrs.has(day) ? { backgroundColor: '#021fdf' } : { backgroundColor: '#f0f0f0' }}
                    >
                      {day.charAt(0)}
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs leading-relaxed mb-3" style={{ color: '#021fdf' }}>
              {selectedClub.description.length > 80 
                ? `${selectedClub.description.substring(0, 80)}...`
                : selectedClub.description
              }
            </p>

            {/* Terrain Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {(() => {
                const getTerrainTags = () => {
                  if (selectedClub.terrain && selectedClub.terrain.length > 0) {
                    return selectedClub.terrain.slice(0, 2).map(terrain => terrain.toUpperCase());
                  }
                  return ['URBAN'];
                };
                
                return getTerrainTags().map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-white font-bold text-xs rounded-full"
                    style={{ backgroundColor: '#021fdf' }}
                  >
                    {tag}
                  </span>
                ));
              })()}
            </div>

            {/* Action button */}
            <a
              href={`/clubs/${selectedClub.slug}`}
              className="block w-full text-center px-3 py-2 text-white rounded-lg hover:opacity-90 transition-colors text-xs font-bold uppercase"
              style={{ backgroundColor: '#021fdf' }}
            >
              View Details
            </a>
          </div>
        </>
      )}
    </div>
  );
} 