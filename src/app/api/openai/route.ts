import { NextRequest, NextResponse } from 'next/server';
import { analyzeWebsite } from '@/lib/openai';
import { getLighthouseMetrics } from '@/lib/pagespeed';
import { AuditResult } from '@/types';

// Mock data for testing without an API key
const mockAuditResult: AuditResult = {
  summary: "This website demonstrates a clean design with a consistent color scheme and modern layout. The brand identity is visually cohesive, though messaging could be clearer about the unique value proposition. Navigation is intuitive, but some pages load slowly and mobile responsiveness needs improvement. Overall, it's a solid foundation that would benefit from targeted enhancements to improve user engagement and conversion rates.",
  strengths: [
    "Consistent color palette and visual elements that create brand recognition",
    "Clean, modern layout with good use of whitespace",
    "Intuitive navigation structure that helps users find information",
    "High-quality imagery that enhances the professional appearance",
    "Good typography choices that maintain readability across the site"
  ],
  weaknesses: [
    "Value proposition and unique selling points aren't clearly communicated on the homepage",
    "Call-to-action buttons lack visual prominence and compelling copy",
    "Mobile experience shows some layout issues on smaller screens",
    "Page load speed is slow, potentially impacting user experience and SEO",
    "Content lacks sufficient keywords and SEO optimization"
  ],
  actionableSteps: [
    "Revise the homepage headline and introduction to clearly state your unique value proposition within the first 5 seconds of a visitor arriving",
    "Redesign call-to-action buttons with contrasting colors, action-oriented text, and more prominent placement on key pages",
    "Implement responsive design improvements for mobile devices, particularly for forms and navigation elements",
    "Optimize image sizes and implement lazy loading to improve page load times across the site",
    "Develop a content strategy that incorporates relevant keywords while maintaining natural, engaging writing"
  ],
  improvements: [
    "Implement customer testimonials and case studies to build credibility and showcase real results for businesses in your industry",
    "Create a lead magnet (like an industry report or checklist) to capture more email subscribers and nurture them through your sales funnel",
    "Add a live chat feature to improve customer support and capture questions from potential customers browsing your services"
  ]
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      website,
      businessGoal,
      industry,
      runningAds,
      targetAudience,
      brandPersonality
    } = body;

    // Validate required field
    if (!website) {
      return NextResponse.json(
        { success: false, message: 'Website URL is required' },
        { status: 400 }
      );
    }

    let auditResult: AuditResult;

    // Decide whether to use mock data or real OpenAI analysis
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      console.log('Using mock data for website analysis (mock flag enabled)');

      // Simulate API delay for a more realistic UI experience
      await new Promise((resolve) => setTimeout(resolve, 3000));

      auditResult = mockAuditResult;
    } else {
      // Ensure the OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured on the server');
      }

      // Fetch Lighthouse metrics in parallel
      const lighthousePromise = getLighthouseMetrics(website);

      // Use real OpenAI API
      const analysisPromise = analyzeWebsite(
        website,
        businessGoal,
        industry,
        runningAds,
        targetAudience,
        brandPersonality
      );

      const [lighthouseData] = await Promise.all([
        lighthousePromise,
        analysisPromise,
      ]);

      auditResult = await analysisPromise;

      // Combine audit result with Lighthouse data
      const responseData = {
        ...auditResult,
        lighthouseData,
      };

    return NextResponse.json({
      success: true,
      message: 'Website analyzed successfully',
      data: responseData,
    });
    }
  } catch (error: unknown) {
    console.error('Error in OpenAI API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze website';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
} 