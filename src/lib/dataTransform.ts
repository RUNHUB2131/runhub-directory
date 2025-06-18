import { DatabaseRunClub, RunClub, RunSession } from '@/types';

/**
 * Transform database run club to frontend format
 * This function handles all the mapping from database schema to component expectations
 */
export function transformRunClub(dbClub: DatabaseRunClub): RunClub {
  return {
    id: dbClub.id,
    slug: dbClub.slug,
    
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
    
    // Meeting info - extract from run_sessions (structured data)
    meeting_day: extractMeetingDay(dbClub.run_sessions),
    meeting_time: extractMeetingTime(dbClub.run_sessions),
    time_of_day: extractTimeOfDay(dbClub.run_sessions),
    run_days: dbClub.run_days || [],
    
    // Include run_sessions for component access
    run_sessions: dbClub.run_sessions || [],
    
    // Club characteristics
    difficulty: extractDifficulty(dbClub.run_sessions, dbClub.short_bio),
    distance_focus: extractDistanceFocus(dbClub.run_sessions),
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
 * Extract primary meeting day from run_sessions array
 */
function extractMeetingDay(runSessions: RunSession[]): string {
  if (!runSessions || runSessions.length === 0) {
    return 'Contact club';
  }
  
  // Get the first session's day
  const firstSession = runSessions[0];
  if (!firstSession || !firstSession.day) {
    return 'Contact club';
  }
  
  const day = firstSession.day.toLowerCase();
  const dayMap: { [key: string]: string } = {
    'monday': 'Monday',
    'tuesday': 'Tuesday', 
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday',
    'sunday': 'Sunday'
  };
  
  return dayMap[day] || 'Contact club';
}

/**
 * Extract meeting time from run_sessions array
 */
function extractMeetingTime(runSessions: RunSession[]): string {
  if (!runSessions || runSessions.length === 0) {
    return 'Contact club';
  }
  
  // Get the first session's time
  const firstSession = runSessions[0];
  if (!firstSession || !firstSession.time || firstSession.time === 'unknown') {
    return 'Contact club';
  }
  
  return firstSession.time;
}

/**
 * Extract time of day from run_sessions
 */
function extractTimeOfDay(runSessions: RunSession[]): 'morning' | 'afternoon' | 'evening' {
  if (!runSessions || runSessions.length === 0) {
    return 'morning'; // Default
  }
  
  const firstSession = runSessions[0];
  if (!firstSession || !firstSession.time || firstSession.time === 'unknown') {
    return 'morning';
  }
  
  const time = firstSession.time.toLowerCase();
  
  // Check for PM times
  if (time.includes('pm')) {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6) {
      return 'evening';
    } else if (hour >= 12) {
      return 'afternoon';
    }
  }
  
  // Check for AM times
  if (time.includes('am')) {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 12 || hour <= 6) {
      return 'morning';
    }
  }
  
  // Default to morning
  return 'morning';
}

/**
 * Extract difficulty level from run sessions and club description
 */
function extractDifficulty(runSessions: RunSession[], shortBio: string): 'beginner' | 'intermediate' | 'advanced' | 'all-levels' {
  const sessionTexts = runSessions.map(s => `${s.run_type || ''} ${s.description || ''}`).join(' ');
  const text = (sessionTexts + ' ' + shortBio).toLowerCase();
  
  if (text.includes('beginner') || text.includes('all welcome') || 
      text.includes('any pace') || text.includes('all levels') ||
      text.includes('any speed') || text.includes('social')) {
    return 'all-levels';
  }
  
  if (text.includes('advanced') || text.includes('competitive') || 
      text.includes('fast') || text.includes('elite') ||
      text.includes('speed') || text.includes('interval')) {
    return 'advanced';
  }
  
  if (text.includes('intermediate') || text.includes('moderate') ||
      text.includes('threshold') || text.includes('tempo')) {
    return 'intermediate';
  }
  
  // Default to all-levels if unsure
  return 'all-levels';
}

/**
 * Extract distance focus from run sessions
 */
function extractDistanceFocus(runSessions: RunSession[]): string[] {
  if (!runSessions || runSessions.length === 0) {
    return ['Various'];
  }
  
  const distances: string[] = [];
  const allText = runSessions.map(s => `${s.distance || ''} ${s.run_type || ''} ${s.description || ''}`).join(' ').toLowerCase();
  
  if (allText.includes('5km') || allText.includes('5k') || allText.includes('parkrun')) {
    distances.push('5K');
  }
  
  if (allText.includes('10km') || allText.includes('10k')) {
    distances.push('10K');
  }
  
  if (allText.includes('half marathon') || allText.includes('21km')) {
    distances.push('Half Marathon');
  }
  
  if (allText.includes('marathon') && !allText.includes('half')) {
    distances.push('Marathon');
  }
  
  if (allText.includes('ultra') || allText.includes('50km') || allText.includes('100km')) {
    distances.push('Ultra');
  }
  
  if (allText.includes('track') || allText.includes('400m') || allText.includes('800m')) {
    distances.push('Track');
  }
  
  // Look for specific distance ranges
  if (allText.includes('long run') || allText.includes('10-') || allText.includes('15-') || allText.includes('20-')) {
    distances.push('Long Distance');
  }
  
  return distances.length > 0 ? distances : ['Various'];
}

/**
 * Clean and validate URLs
 */
function cleanUrl(url?: string): string | undefined {
  if (!url || url.trim() === '') {
    return undefined;
  }
  
  let cleaned = url.trim();
  
  // Add protocol if missing
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned;
  }
  
  try {
    new URL(cleaned);
    return cleaned;
  } catch {
    return undefined;
  }
}

/**
 * Clean Instagram URLs to standard format
 */
function cleanInstagramUrl(url?: string): string | undefined {
  if (!url || url.trim() === '') {
    return undefined;
  }
  
  let cleaned = url.trim();
  
  // Extract Instagram handle if it's a full URL
  const instagramMatch = cleaned.match(/(?:www\.)?instagram\.com\/([^\/\?]+)/);
  if (instagramMatch) {
    cleaned = `https://www.instagram.com/${instagramMatch[1]}`;
  } else if (!cleaned.startsWith('http')) {
    // If it's just a handle, construct the full URL
    cleaned = cleaned.replace('@', '');
    cleaned = `https://www.instagram.com/${cleaned}`;
  }
  
  try {
    new URL(cleaned);
    return cleaned;
  } catch {
    return undefined;
  }
}

/**
 * Transform array of database run clubs to frontend format
 */
export function transformRunClubs(dbClubs: DatabaseRunClub[]): RunClub[] {
  return dbClubs.map(transformRunClub);
} 