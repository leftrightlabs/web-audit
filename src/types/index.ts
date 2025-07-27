// Valid values for form fields based on the zod schema
export type WebsiteGoalType = 'Generate leads' | 'Sell products' | 'Build brand awareness' | 'Book appointments' | 'Other';
export type IndustryType = 'Coaching / Consulting' | 'eCommerce / Retail' | 'SaaS / Tech' | 'Health & Wellness' | 'Creative / Portfolio' | 'Other';
export type TargetAudienceType = 'Consumers (B2C)' | 'Businesses (B2B)' | 'Nonprofits / Education' | "I'm not sure";
export type BrandPersonalityType = 'Professional & Polished' | 'Bold & Energetic' | 'Minimal & Modern' | 'Friendly & Approachable' | 'Luxurious & High-End';
export type MarketingCampaignsType = 'Yes – Social Media Ads' | 'Yes – Google Ads' | 'No – Not yet' | 'Not sure';
export type ImprovementAreaType = 'Design / Visual Appeal' | 'Messaging / Copywriting' | 'SEO / Visibility' | 'Conversion / Lead Capture' | 'Overall Strategy';

export interface FormData {
  name: string;
  email: string;
  website: string;
  businessGoal?: string;
  industry?: string;
  runningAds?: string;
  // New preference fields with proper types
  websiteGoal?: WebsiteGoalType; 
  industryType?: IndustryType;
  targetAudience?: TargetAudienceType;
  brandPersonality?: BrandPersonalityType;
  marketingCampaigns?: MarketingCampaignsType;
  improvementArea?: ImprovementAreaType;
}

export interface AuditResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  actionableSteps: string[];
  improvements: string[];
  // Optional enriched fields for the enhanced report
  pillarScores?: {
    branding: number; // Branding & Positioning 0-100
    ux: number;       // UX & Design 0-100
    conversion: number; // Conversion & Trust 0-100
    content: number;  // Content & SEO 0-100
  };
  /** Hex color values extracted from the site (e.g. ["#21145f", "#7950f2", ...]) */
  colorPalette?: string[];
  /** Top fonts detected on the site (e.g. ["Inter", "Roboto"]) */
  fonts?: string[];
}

export interface LighthouseData {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
} 