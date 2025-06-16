import { createClient } from '@supabase/supabase-js';
import { RunClub } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database utility functions
export async function getAllClubs(): Promise<RunClub[]> {
  const { data, error } = await supabase
    .from('run_clubs')
    .select('*')
    .eq('status', 'approved')
    .order('club_name');

  if (error) {
    console.error('Error fetching clubs:', error);
    return [];
  }

  return data || [];
}

export async function getClubById(id: string): Promise<RunClub | null> {
  const { data, error } = await supabase
    .from('run_clubs')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .single();

  if (error) {
    console.error('Error fetching club:', error);
    return null;
  }

  return data;
}

export async function searchClubs(query: string): Promise<RunClub[]> {
  const { data, error } = await supabase
    .from('run_clubs')
    .select('*')
    .eq('status', 'approved')
    .or(`club_name.ilike.%${query}%,short_bio.ilike.%${query}%,suburb_or_town.ilike.%${query}%`)
    .order('club_name');

  if (error) {
    console.error('Error searching clubs:', error);
    return [];
  }

  return data || [];
} 