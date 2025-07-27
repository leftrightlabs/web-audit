import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AuditResult, LighthouseData } from '@/types';

interface TokenPayload {
  auditResult: AuditResult;
  lighthouseData: LighthouseData | null;
  website: string;
  created_at: string;
  expires_at: string;
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      );
    }

    // Fetch the report data from Supabase using the short ID
    const { data, error } = await supabase
      .from('shared_reports')
      .select('*')
      .eq('short_id', token)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: 'Report not found' },
        { status: 404 }
      );
    }

    // Check if the report has expired
    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    
    if (now > expiresAt) {
      return NextResponse.json(
        { success: false, message: 'Report has expired' },
        { status: 410 }
      );
    }

    const payload: TokenPayload = {
      auditResult: data.audit_result,
      lighthouseData: data.lighthouse_data,
      website: data.website,
      created_at: data.created_at,
      expires_at: data.expires_at
    };

    return NextResponse.json({
      success: true,
      payload,
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid or expired token' },
      { status: 401 }
    );
  }
} 