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
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
} 