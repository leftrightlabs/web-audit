export interface FormData {
  name: string;
  email: string;
  website: string;
  businessGoal?: string;
  industry?: string;
  runningAds?: string;
  // New preference fields
  websiteGoal?: string; // "Generate leads", "Sell products", "Build brand awareness", "Book appointments", "Other"
  industryType?: string; // "Coaching / Consulting", "eCommerce / Retail", "SaaS / Tech", "Health & Wellness", "Creative / Portfolio", "Other"
  targetAudience?: string; // "Consumers (B2C)", "Businesses (B2B)", "Nonprofits / Education", "I'm not sure"
  brandPersonality?: string; // "Professional & Polished", "Bold & Energetic", "Minimal & Modern", "Friendly & Approachable", "Luxurious & High-End"
  marketingCampaigns?: string; // "Yes – Social Media Ads", "Yes – Google Ads", "No – Not yet", "Not sure"
  improvementArea?: string; // "Design / Visual Appeal", "Messaging / Copywriting", "SEO / Visibility", "Conversion / Lead Capture", "Overall Strategy"
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
  data?: any;
} 