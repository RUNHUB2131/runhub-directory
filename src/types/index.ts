export interface RunClub {
  id: string;
  // Basic club info
  clubName: string;
  contactName: string;
  shortBio: string;
  
  // URLs
  websiteUrl?: string;
  instagramUrl?: string;
  stravaUrl?: string;
  additionalUrl?: string;
  
  // Location
  suburbOrTown: string;
  postcode: string;
  state: string; // Australian states
  latitude: number;
  longitude: number;
  
  // Run details - up to 7 different runs
  runDetails: string[];
  
  // Schedule
  runDays: string[]; // Array of days: 'monday', 'tuesday', etc.
  
  // Club characteristics
  clubType: 'everyone' | 'women-only' | 'men-only';
  isPaid: 'free' | 'paid';
  
  // Activities
  extracurriculars: string[]; // Array from: 'post-run meals', 'post-run drinks', 'parkrun', 'social events', 'coaching', 'post-run swim', 'post-run coffee'
  terrain: string[]; // Array from: 'urban', 'track', 'hills', 'soft sand', 'trail running', 'grass'
  
  // Media
  clubPhoto?: string; // URL to uploaded photo
  
  // Private contact info
  leaderName?: string; // private
  contactMobile?: string; // private
  contactEmail: string; // private - this is the main club email
  
  // System fields
  created_at: string;
  updated_at: string;
}

export interface FilterState {
  searchQuery: string;
  states: string[];
  meetingDays: string[];
  timeOfDay: string[];
  difficulty: string[];
  distanceFocus: string[];
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
} 