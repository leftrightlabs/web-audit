import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// These environment variables need to be set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Create a mock client for when credentials are missing
const createMockClient = () => {
  // This creates a mock client that logs operations but doesn't actually connect to Supabase
  return {
    from: (table: string) => ({
      insert: (data: any) => {
        console.log(`[Mock Supabase] Would insert into ${table}:`, data);
        return {
          select: (column: string) => ({
            single: () => Promise.resolve({ 
              data: { id: 'mock-id-' + Date.now() }, 
              error: null 
            })
          })
        };
      }
    }),
    // Add other methods as needed
  } as any;
};

// Create a Supabase client with the public anon key for client-side usage
// Or return a mock client if credentials are missing
export const supabase = isSupabaseConfigured() 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : createMockClient();

// For server-side operations (API routes) with service role key
// This should never be exposed to the client
let supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabaseAdmin = () => {
  if (supabaseAdmin) return supabaseAdmin;
  
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  // If not configured, return a mock client
  if (!isSupabaseConfigured() || !supabaseServiceKey) {
    console.warn('Supabase admin client not configured. Using mock client.');
    return createMockClient();
  }
  
  supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  return supabaseAdmin;
}; 