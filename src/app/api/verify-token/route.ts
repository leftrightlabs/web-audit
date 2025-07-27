import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { AuditResult, LighthouseData } from '@/types';

// Ensure this route runs in the Node.js runtime
export const runtime = 'nodejs';

// Secret used to verify the JWT
const JWT_SECRET = process.env.MAGIC_LINK_SECRET || 'development-secret-key';

interface TokenPayload {
  auditResult: AuditResult;
  lighthouseData: LighthouseData | null;
  website: string;
  iat: number;
  exp: number;
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

    // Verify the JWT token
    const payload = jwt.verify(decodeURIComponent(token), JWT_SECRET) as TokenPayload;

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