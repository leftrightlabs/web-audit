import { supabase } from '@/lib/supabase';

// Generate a random short ID (6 characters)
export function generateShortId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Check if a short ID already exists in the database
export async function isShortIdUnique(shortId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('shared_reports')
    .select('short_id')
    .eq('short_id', shortId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
    console.error('Error checking short ID uniqueness:', error);
    return false;
  }

  return !data; // Return true if no data found (ID is unique)
}

// Generate a unique short ID
export async function generateUniqueShortId(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const shortId = generateShortId();
    const isUnique = await isShortIdUnique(shortId);
    
    if (isUnique) {
      return shortId;
    }
    
    attempts++;
  }

  throw new Error('Failed to generate unique short ID after maximum attempts');
} 