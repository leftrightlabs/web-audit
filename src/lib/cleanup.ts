import { supabase } from '@/lib/supabase';

// Clean up expired shared reports
export async function cleanupExpiredReports(): Promise<number> {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('shared_reports')
    .delete()
    .lt('expires_at', now)
    .select('short_id');

  if (error) {
    console.error('Error cleaning up expired reports:', error);
    return 0;
  }

  const deletedCount = data?.length || 0;
  console.log(`Cleaned up ${deletedCount} expired shared reports`);
  
  return deletedCount;
}

// Optional: Function to get report statistics
export async function getReportStats() {
  const now = new Date().toISOString();
  
  // Get total reports
  const { count: totalReports } = await supabase
    .from('shared_reports')
    .select('*', { count: 'exact', head: true });

  // Get active reports (not expired)
  const { count: activeReports } = await supabase
    .from('shared_reports')
    .select('*', { count: 'exact', head: true })
    .gte('expires_at', now);

  return {
    total: totalReports || 0,
    active: activeReports || 0,
    expired: (totalReports || 0) - (activeReports || 0)
  };
} 