import { NextRequest, NextResponse } from 'next/server';
import { addContact } from '@/lib/activecampaign';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, website, businessGoal, industry, runningAds } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if ActiveCampaign API credentials are available or if we're in mock mode
    if (!process.env.ACTIVECAMPAIGN_API_KEY || 
        !process.env.ACTIVECAMPAIGN_API_URL || 
        process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      // Log the data without making a real API call
      console.log('Using mock mode for ActiveCampaign. Contact info:', {
        name,
        email,
        website,
        businessGoal,
        industry,
        runningAds
      });
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      return NextResponse.json({
        success: true,
        message: 'Contact info logged (mock mode)',
        data: { contactId: 'mock-contact-id' }
      });
    }

    // Add contact to ActiveCampaign
    const result = await addContact(
      name,
      email,
      website,
      businessGoal,
      industry,
      runningAds
    );

    return NextResponse.json({
      success: true,
      message: 'Contact added successfully',
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