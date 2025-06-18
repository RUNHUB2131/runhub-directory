import { createClient } from '@supabase/supabase-js';
import { DatabaseRunClub, RunClub } from '@/types';
import { transformRunClub, transformRunClubs } from '@/lib/dataTransform';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database utility functions
export async function getAllClubs(): Promise<RunClub[]> {
  const { data, error } = await supabase
    .from('run_clubs')
    .select(`
      id,
      slug,
      club_name,
      contact_name,
      short_bio,
      website_url,
      instagram_url,
      strava_url,
      additional_url,
      suburb_or_town,
      postcode,
      state,
      latitude,
      longitude,
      run_details,
      run_days,
      run_sessions,
      club_type,
      is_paid,
      extracurriculars,
      terrain,
      club_photo,
      created_at,
      updated_at
    `)
    .eq('status', 'approved')
    .order('club_name');

  if (error) {
    console.error('Error fetching clubs:', error);
    return [];
  }

  if (!data) return [];

  // Transform database records to frontend format
  return transformRunClubs(data as DatabaseRunClub[]);
}

export async function getClubBySlug(slug: string): Promise<RunClub | null> {
  const { data, error } = await supabase
    .from('run_clubs')
    .select(`
      id,
      slug,
      club_name,
      contact_name,
      short_bio,
      website_url,
      instagram_url,
      strava_url,
      additional_url,
      suburb_or_town,
      postcode,
      state,
      latitude,
      longitude,
      run_details,
      run_days,
      run_sessions,
      club_type,
      is_paid,
      extracurriculars,
      terrain,
      club_photo,
      created_at,
      updated_at
    `)
    .eq('slug', slug)
    .eq('status', 'approved')
    .single();

  if (error) {
    console.error('Error fetching club by slug:', error);
    return null;
  }

  if (!data) return null;

  // Transform database record to frontend format
  return transformRunClub(data as DatabaseRunClub);
}

export async function getClubById(id: string): Promise<RunClub | null> {
  const { data, error } = await supabase
    .from('run_clubs')
    .select(`
      id,
      slug,
      club_name,
      contact_name,
      short_bio,
      website_url,
      instagram_url,
      strava_url,
      additional_url,
      suburb_or_town,
      postcode,
      state,
      latitude,
      longitude,
      run_details,
      run_days,
      run_sessions,
      club_type,
      is_paid,
      extracurriculars,
      terrain,
      club_photo,
      created_at,
      updated_at
    `)
    .eq('id', id)
    .eq('status', 'approved')
    .single();

  if (error) {
    console.error('Error fetching club:', error);
    return null;
  }

  if (!data) return null;

  // Transform database record to frontend format
  return transformRunClub(data as DatabaseRunClub);
}

export async function searchClubs(query: string): Promise<RunClub[]> {
  const { data, error } = await supabase
    .from('run_clubs')
    .select(`
      id,
      slug,
      club_name,
      contact_name,
      short_bio,
      website_url,
      instagram_url,
      strava_url,
      additional_url,
      suburb_or_town,
      postcode,
      state,
      latitude,
      longitude,
      run_details,
      run_days,
      run_sessions,
      club_type,
      is_paid,
      extracurriculars,
      terrain,
      club_photo,
      created_at,
      updated_at
    `)
    .eq('status', 'approved')
    .or(`club_name.ilike.%${query}%,short_bio.ilike.%${query}%,suburb_or_town.ilike.%${query}%`)
    .order('club_name');

  if (error) {
    console.error('Error searching clubs:', error);
    return [];
  }

  if (!data) return [];

  // Transform database records to frontend format
  return transformRunClubs(data as DatabaseRunClub[]);
}

export async function getClubsByState(state: string): Promise<RunClub[]> {
  const { data, error } = await supabase
    .from('run_clubs')
    .select(`
      id,
      slug,
      club_name,
      contact_name,
      short_bio,
      website_url,
      instagram_url,
      strava_url,
      additional_url,
      suburb_or_town,
      postcode,
      state,
      latitude,
      longitude,
      run_details,
      run_days,
      run_sessions,
      club_type,
      is_paid,
      extracurriculars,
      terrain,
      club_photo,
      created_at,
      updated_at
    `)
    .eq('status', 'approved')
    .eq('state', state)
    .order('club_name');

  if (error) {
    console.error('Error fetching clubs by state:', error);
    return [];
  }

  if (!data) return [];

  // Transform database records to frontend format
  return transformRunClubs(data as DatabaseRunClub[]);
}

export async function getClubsByFilters(filters: {
  state?: string;
  clubType?: string;
  isPaid?: string;
  runDays?: string[];
}): Promise<RunClub[]> {
  let query = supabase
    .from('run_clubs')
    .select(`
      id,
      slug,
      club_name,
      contact_name,
      short_bio,
      website_url,
      instagram_url,
      strava_url,
      additional_url,
      suburb_or_town,
      postcode,
      state,
      latitude,
      longitude,
      run_details,
      run_days,
      run_sessions,
      club_type,
      is_paid,
      extracurriculars,
      terrain,
      club_photo,
      created_at,
      updated_at
    `)
    .eq('status', 'approved');

  if (filters.state) {
    query = query.eq('state', filters.state);
  }

  if (filters.clubType) {
    query = query.eq('club_type', filters.clubType);
  }

  if (filters.isPaid) {
    query = query.eq('is_paid', filters.isPaid);
  }

  if (filters.runDays && filters.runDays.length > 0) {
    query = query.overlaps('run_days', filters.runDays);
  }

  const { data, error } = await query.order('club_name');

  if (error) {
    console.error('Error fetching clubs with filters:', error);
    return [];
  }

  if (!data) return [];

  // Transform database records to frontend format
  return transformRunClubs(data as DatabaseRunClub[]);
} 