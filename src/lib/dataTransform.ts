import { DatabaseRunClub, RunClub } from '@/types';

/**
 * Transform database run club to frontend format
 * This function handles all the mapping from database schema to component expectations
 */
export function transformRunClub(dbClub: DatabaseRunClub): RunClub {
  return {
    id: dbClub.id,
    
    // Basic info transformations
    name: dbClub.club_name,
    description: dbClub.short_bio,
    location: `${dbClub.suburb_or_town}, ${dbClub.state}`,
    suburb: dbClub.suburb_or_town,
    state: dbClub.state,
    postcode: dbClub.postcode,
    
    // Coordinates
    coordinates: {
      lat: dbClub.latitude,
      lng: dbClub.longitude
    },
    
    // Meeting info - extract from run_days and run_details
    meeting_day: extractMeetingDay(dbClub.run_days),
    meeting_time: extractMeetingTime(dbClub.run_details),
    time_of_day: extractTimeOfDay(dbClub.run_details),
    
    // Club characteristics
    difficulty: extractDifficulty(dbClub.run_details, dbClub.short_bio),
    distance_focus: extractDistanceFocus(dbClub.run_details),
    club_type: dbClub.club_type,
    is_paid: dbClub.is_paid,
    
    // Activities and terrain
    extracurriculars: dbClub.extracurriculars || [],
    terrain: dbClub.terrain || [],
    
    // URLs - clean and format
    website: cleanUrl(dbClub.website_url),
    instagram: cleanInstagramUrl(dbClub.instagram_url),
    strava: cleanUrl(dbClub.strava_url),
    
    // Media
    club_photo: dbClub.club_photo,
    
    // System fields
    created_at: dbClub.created_at,
    updated_at: dbClub.updated_at
    
    // Note: contact_email is intentionally excluded for security
  };
}

/**
 * Extract primary meeting day from run_days array
 */
function extractMeetingDay(runDays: string[]): string {
  if (!runDays || runDays.length === 0) {
    return 'Contact club';
  }
  
  // Convert first day to proper format
  const firstDay = runDays[0].toLowerCase();
  const dayMap: { [key: string]: string } = {
    'monday': 'Monday',
    'tuesday': 'Tuesday', 
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday',
    'sunday': 'Sunday',
    'mon': 'Monday',
    'tue': 'Tuesday',
    'wed': 'Wednesday',
    'thu': 'Thursday',
    'fri': 'Friday',
    'sat': 'Saturday',
    'sun': 'Sunday'
  };
  
  return dayMap[firstDay] || 'Contact club';
}

/**
 * Extract meeting time from run_details array
 */
function extractMeetingTime(runDetails: string[]): string {
  if (!runDetails || runDetails.length === 0) {
    return 'Contact club';
  }
  
  // Look for time patterns in run details
  const timePattern = /(\d{1,2}:\d{2}\s?(AM|PM|am|pm)|\d{1,2}(AM|PM|am|pm))/;
  
  for (const detail of runDetails) {
    const match = detail.match(timePattern);
    if (match) {
      return match[0].toUpperCase();
    }
  }
  
  return 'Contact club';
}

/**
 * Extract time of day from run_details
 */
function extractTimeOfDay(runDetails: string[]): 'morning' | 'afternoon' | 'evening' {
  if (!runDetails || runDetails.length === 0) {
    return 'morning'; // Default
  }
  
  const detailsText = runDetails.join(' ').toLowerCase();
  
  // Check for explicit time indicators
  if (detailsText.includes('evening') || detailsText.includes('night') || 
      detailsText.includes('6:00 pm') || detailsText.includes('7:00 pm') ||
      detailsText.includes('18:') || detailsText.includes('19:')) {
    return 'evening';
  }
  
  if (detailsText.includes('afternoon') || detailsText.includes('lunch') ||
      detailsText.includes('12:') || detailsText.includes('1:00 pm') ||
      detailsText.includes('2:00 pm') || detailsText.includes('3:00 pm')) {
    return 'afternoon';
  }
  
  // Default to morning for early times or no specific indicator
  return 'morning';
}

/**
 * Extract difficulty level from description and run details
 */
function extractDifficulty(runDetails: string[], shortBio: string): 'beginner' | 'intermediate' | 'advanced' | 'all-levels' {
  const text = (runDetails.join(' ') + ' ' + shortBio).toLowerCase();
  
  if (text.includes('beginner') || text.includes('all welcome') || 
      text.includes('any pace') || text.includes('all levels') ||
      text.includes('any speed')) {
    return 'all-levels';
  }
  
  if (text.includes('advanced') || text.includes('competitive') || 
      text.includes('fast') || text.includes('elite')) {
    return 'advanced';
  }
  
  if (text.includes('intermediate') || text.includes('moderate')) {
    return 'intermediate';
  }
  
  // Default to all-levels if unsure
  return 'all-levels';
}

/**
 * Extract distance focus from run details
 */
function extractDistanceFocus(runDetails: string[]): string[] {
  if (!runDetails || runDetails.length === 0) {
    return ['Various'];
  }
  
  const text = runDetails.join(' ').toLowerCase();
  const distances: string[] = [];
  
  if (text.includes('5km') || text.includes('5k') || text.includes('parkrun')) {
    distances.push('5K');
  }
  
  if (text.includes('10km') || text.includes('10k')) {
    distances.push('10K');
  }
  
  if (text.includes('half marathon') || text.includes('21km')) {
    distances.push('Half Marathon');
  }
  
  if (text.includes('marathon') && !text.includes('half')) {
    distances.push('Marathon');
  }
  
  if (text.includes('ultra') || text.includes('50km') || text.includes('100km')) {
    distances.push('Ultra');
  }
  
  if (text.includes('track') || text.includes('400m') || text.includes('800m')) {
    distances.push('Track');
  }
  
  return distances.length > 0 ? distances : ['Various'];
}

/**
 * Clean and validate URLs
 */
function cleanUrl(url?: string): string | undefined {
  if (!url || url === 'Unknown' || url.trim() === '') {
    return undefined;
  }
  
  // Add https:// if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  
  return url;
}

/**
 * Clean Instagram URLs to just handle format
 */
function cleanInstagramUrl(url?: string): string | undefined {
  if (!url || url === 'Unknown' || url.trim() === '') {
    return undefined;
  }
  
  // Extract Instagram handle if it's a full URL
  if (url.includes('instagram.com/')) {
    const match = url.match(/instagram\.com\/([^\/\?]+)/);
    if (match) {
      return `@${match[1]}`;
    }
  }
  
  // If it's already a handle, ensure it starts with @
  if (url.startsWith('@')) {
    return url;
  }
  
  return `@${url}`;
}

/**
 * Transform multiple database clubs to frontend format
 */
export function transformRunClubs(dbClubs: DatabaseRunClub[]): RunClub[] {
  return dbClubs.map(transformRunClub);
} 