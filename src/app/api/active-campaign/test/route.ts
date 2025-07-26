import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/lib/activecampaign';

export async function GET(req: NextRequest) {
  try {
    // Test the connection
    const result = await testConnection();
    
    // Return the result
    return NextResponse.json({
      success: result.success,
      message: result.message,
      apiUrlSet: !!process.env.AC_API_URL,
      apiKeySet: !!process.env.AC_API_KEY,
      mockMode: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
    });
  } catch (error) {
    // Handle errors
    return NextResponse.json({
      success: false,
      message: `Error testing ActiveCampaign connection: ${error.message || 'Unknown error'}`,
      apiUrlSet: !!process.env.AC_API_URL,
      apiKeySet: !!process.env.AC_API_KEY,
      mockMode: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
    }, { status: 500 });
  }
} 