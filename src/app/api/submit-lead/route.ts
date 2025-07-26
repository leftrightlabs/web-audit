import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { FormData } from '@/types';
import { WebsiteAuditInsert } from '@/types/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as FormData;
    
    if (!body.name || !body.email || !body.website) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured. Skipping database save.');
      return NextResponse.json({
        success: true,
        message: 'Lead data processed successfully (Supabase storage skipped)',
      });
    }

    try {
      const supabase = getSupabaseAdmin();
      
      const auditRecord: WebsiteAuditInsert = {
        name: body.name,
        email: body.email,
        website_url: body.website,
        goal: body.websiteGoal || null,
        industry: body.industryType || null,
        audience_type: body.targetAudience || null,
        brand_personality: body.brandPersonality || null,
        marketing_status: body.marketingCampaigns || null,
        help_focus: body.improvementArea || null
      };
      
      const { data, error } = await supabase
        .from('website_audits')
        .insert(auditRecord)
        .select('id')
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json(
          { success: false, message: 'Failed to save lead data to database' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Lead data saved successfully',
        data: { id: data.id }
      });
    } catch (supabaseError) {
      console.error('Error saving to Supabase:', supabaseError);
      return NextResponse.json({
        success: true,
        message: 'Lead data processed successfully (Supabase storage failed)',
      });
    }
    
  } catch (error) {
    console.error('Error saving lead data:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 