import { NextRequest, NextResponse } from 'next/server';
import { addContact } from '@/lib/activecampaign';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      name, 
      email, 
      website, // This might come from various sources
      websiteGoal,
      industryType,
      targetAudience,
      brandPersonality,
      marketingCampaigns,
      improvementArea
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }

    console.log('ActiveCampaign API URL:', process.env.AC_API_URL);
    console.log('Using API URL format check:', process.env.AC_API_URL?.startsWith('https://') && 
                process.env.AC_API_URL?.includes('.api-us1.com'));

    // Log what we're sending to ActiveCampaign
    console.log('Sending to ActiveCampaign List ID 36:', {
      name,
      email,
      website,
      websiteGoal,
      industryType,
      marketingCampaigns
    });

    // Check if ActiveCampaign API credentials are available or if we're in mock mode
    if (!process.env.AC_API_KEY || 
        !process.env.AC_API_URL || 
        process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      // Log the data without making a real API call
      console.log('Using mock mode for ActiveCampaign. Would add to List ID 36:', {
        name,
        email,
        website,
        websiteGoal,
        industryType,
        targetAudience,
        brandPersonality,
        marketingCampaigns,
        improvementArea
      });
      
      // For debugging: show if this is due to missing credentials or explicit mock mode
      if (!process.env.AC_API_KEY || !process.env.AC_API_URL) {
        console.warn('ActiveCampaign credentials missing. Set AC_API_KEY and AC_API_URL in .env.local');
      }
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      return NextResponse.json({
        success: true,
        message: 'Contact would be added to List ID 36 (mock mode)',
        data: { contactId: 'mock-contact-id' }
      });
    }

    // Add contact to ActiveCampaign with List ID 36
    const result = await addContact(
      name,
      email,
      website, // Pass the website URL
      websiteGoal,
      industryType,
      marketingCampaigns
    );

    return NextResponse.json({
      success: true,
      message: 'Contact added successfully to List ID 36',
      data: result,
    });
  } catch (error) {
    console.error('Error in ActiveCampaign API:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add contact' },
      { status: 500 }
    );
  }
} 