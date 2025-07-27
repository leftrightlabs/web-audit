import { NextRequest, NextResponse } from 'next/server';
import { cleanupExpiredReports, getReportStats } from '@/lib/cleanup';

export async function POST(req: NextRequest) {
  try {
    // Optional: Add authentication here for production
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CLEANUP_SECRET}`) {
    //   return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    // }

    // Clean up expired reports
    const deletedCount = await cleanupExpiredReports();
    
    // Get current stats
    const stats = await getReportStats();

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${deletedCount} expired reports`,
      stats
    });
  } catch (error) {
    console.error('Cleanup failed:', error);
    return NextResponse.json(
      { success: false, message: 'Cleanup failed' },
      { status: 500 }
    );
  }
}

// Also allow GET for monitoring
export async function GET() {
  try {
    const stats = await getReportStats();
    
    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Failed to get stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get stats' },
      { status: 500 }
    );
  }
} 