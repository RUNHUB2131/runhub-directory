// Database types - matching the Supabase schema
export interface DatabaseRunClub {
  id: string;
  club_name: string;
  contact_name: string;
  short_bio: string;
  website_url?: string;
  instagram_url?: string;
  strava_url?: string;
  additional_url?: string;
  suburb_or_town: string;
  postcode: string;
  state: string;
  latitude: number;
  longitude: number;
  run_details: string[];
  run_days: string[];
  club_type: 'everyone' | 'women-only' | 'men-only';
  is_paid: 'free' | 'paid';
  extracurriculars: string[];
  terrain: string[];
  club_photo?: string;
  leader_name?: string;
  contact_mobile?: string;
  contact_email: string; // This should NEVER be exposed to frontend
  status: 'pending' | 'approved' | 'rejected';
  approval_token?: string;
  approved_at?: string;
  approved_by?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

// Transformed types for frontend components
export interface RunClub {
  id: string;
  // Basic club info - transformed from database
  name: string; // from club_name
  description: string; // from short_bio
  location: string; // constructed from suburb_or_town + state
  suburb: string; // from suburb_or_town
  state: string;
  postcode: string;
  
  // Coordinates for map
  coordinates: {
    lat: number; // from latitude
    lng: number; // from longitude
  };
  
  // Meeting info - extracted/derived from run_details and run_days
  meeting_day: string; // primary day from run_days array
  meeting_time: string; // extracted from run_details or default
  time_of_day: 'morning' | 'afternoon' | 'evening'; // derived from meeting_time
  
  // Club characteristics
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all-levels'; // derived or default
  distance_focus: string[]; // extracted from run_details or default
  club_type: 'everyone' | 'women-only' | 'men-only';
  is_paid: 'free' | 'paid';
  
  // Activities and terrain
  extracurriculars: string[];
  terrain: string[];
  
  // URLs (cleaned)
  website?: string; // from website_url
  instagram?: string; // from instagram_url (cleaned)
  strava?: string; // from strava_url
  
  // Media
  club_photo?: string;
  
  // System fields
  created_at: string;
  updated_at: string;
  
  // Note: contact_email is deliberately excluded for security
}

export interface FilterState {
  searchQuery: string;
  states: string[];
  meetingDays: string[];
  timeOfDay: string[];
  distanceFocus: string[];
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
} 