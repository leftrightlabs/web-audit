import { NextResponse } from 'next/server';

export async function GET() {
  const activeCampaignApiUrl = process.env.AC_API_URL;
  const activeCampaignApiKey = process.env.AC_API_KEY;
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA;
  const websiteFieldId = process.env.AC_FIELD_WEBSITE;
  
  return NextResponse.json({
    activeCampaignApiUrlSet: !!activeCampaignApiUrl,
    activeCampaignApiUrlFirstChars: activeCampaignApiUrl ? activeCampaignApiUrl.substring(0, 8) + '...' : 'not set',
    activeCampaignApiKeySet: !!activeCampaignApiKey,
    activeCampaignApiKeyFirstChars: activeCampaignApiKey ? activeCampaignApiKey.substring(0, 5) + '...' : 'not set',
    websiteFieldIdSet: !!websiteFieldId,
    websiteFieldId: websiteFieldId || 'not set',
    useMockData: useMockData || 'not set',
    nodeEnv: process.env.NODE_ENV,
  });
} 