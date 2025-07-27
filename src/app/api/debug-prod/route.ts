import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Debug: Testing production Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('shared_reports')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Debug: Supabase error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      count: data || 0,
      env: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...'
      }
    });
    
  } catch (err) {
    console.error('Debug: Unexpected error:', err);
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined
    });
  }
} 