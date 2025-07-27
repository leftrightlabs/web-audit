import { NextRequest, NextResponse } from 'next/server';
import { AuditResult, LighthouseData } from '@/types';
import { supabase } from '@/lib/supabase';
import { generateUniqueShortId } from '@/lib/shortId';

interface RequestBody {
  auditResult: AuditResult;
  lighthouseData: LighthouseData | null;
  website: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { auditResult, lighthouseData, website } = body;

    // Basic validation
    if (!auditResult || !website) {
      return NextResponse.json(
        { success: false, message: 'Missing required report data' },
        { status: 400 }
      );
    }

    // Generate a unique short ID
    const shortId = await generateUniqueShortId();

    // Calculate expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Store the report data in Supabase
    const { error } = await supabase
      .from('shared_reports')
      .insert({
        short_id: shortId,
        audit_result: auditResult,
        lighthouse_data: lighthouseData,
        website: website,
        expires_at: expiresAt.toISOString()
      });

    if (error) {
      console.error('Error storing shared report:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to store report data' },
        { status: 500 }
      );
    }

    // Determine the base URL dynamically
    const origin =
      req.headers.get('origin') ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'https://audit.leftrightlabs.com';

    // Construct the short shareable URL
    const shareUrl = `${origin}/report/${shortId}`;

    return NextResponse.json({ success: true, url: shareUrl });
  } catch (error) {
    console.error('Error generating magic link:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate magic link' },
      { status: 500 }
    );
  }
} 