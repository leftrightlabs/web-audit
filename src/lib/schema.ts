import { z } from 'zod';

export const leadFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' })
});

// Updated preferences form schema with website URL
export const preferencesFormSchema = z.object({
  website: z.string().url({ message: 'Please enter a valid website URL' }),
  websiteGoal: z.enum([
    'Generate leads', 
    'Sell products', 
    'Build brand awareness', 
    'Book appointments', 
    'Other'
  ]).optional(),
  industryType: z.enum([
    'Coaching / Consulting',
    'eCommerce / Retail',
    'SaaS / Tech',
    'Health & Wellness',
    'Creative / Portfolio',
    'Other'
  ]).optional(),
  targetAudience: z.enum([
    'Consumers (B2C)',
    'Businesses (B2B)',
    'Nonprofits / Education',
    'I\'m not sure'
  ]).optional(),
  brandPersonality: z.enum([
    'Professional & Polished',
    'Bold & Energetic',
    'Minimal & Modern',
    'Friendly & Approachable',
    'Luxurious & High-End'
  ]).optional(),
  marketingCampaigns: z.enum([
    'Yes – Social Media Ads',
    'Yes – Google Ads',
    'No – Not yet',
    'Not sure'
  ]).optional(),
  improvementArea: z.enum([
    'Design / Visual Appeal',
    'Messaging / Copywriting',
    'SEO / Visibility',
    'Conversion / Lead Capture',
    'Overall Strategy'
  ]).optional()
});

// Remove the websiteFormSchema and use the combined form schema
export const formSchema = leadFormSchema.merge(preferencesFormSchema);

// Add new table for shared reports
export const sharedReportsTable = {
  id: 'shared_reports',
  columns: {
    short_id: 'text primary key',
    audit_result: 'jsonb not null',
    lighthouse_data: 'jsonb',
    website: 'text not null',
    created_at: 'timestamp with time zone default timezone(\'utc\'::text, now()) not null',
    expires_at: 'timestamp with time zone not null'
  }
} as const;

export type LeadFormValues = z.infer<typeof leadFormSchema>;
export type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;
export type FormValues = z.infer<typeof formSchema>; 