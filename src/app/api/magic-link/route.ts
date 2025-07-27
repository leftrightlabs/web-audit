import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { AuditResult, LighthouseData } from '@/types';

// Secret used to sign the JWT. MUST be set in the environment in production.
const JWT_SECRET = process.env.MAGIC_LINK_SECRET || 'development-secret-key';

interface RequestBody {
  auditResult: AuditResult;
  lighthouseData: LighthouseData | null;
  website: string;
}

// Ensure this route runs in the Node.js runtime so we can use "jsonwebtoken"
export const runtime = 'nodejs';

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

    // Sign a JWT valid for 30 days containing the report payload
    const token = jwt.sign({ auditResult, lighthouseData, website }, JWT_SECRET, {
      expiresIn: '30d',
    });

    // Determine the base URL dynamically (falls back to env variable or localhost)
    const origin =
      req.headers.get('origin') ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'http://localhost:3000';

    // Construct the full shareable URL
    const shareUrl = `${origin}/report/${encodeURIComponent(token)}`;

    return NextResponse.json({ success: true, url: shareUrl });
  } catch (error) {
    console.error('Error generating magic link:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate magic link' },
      { status: 500 }
    );
  }
} 