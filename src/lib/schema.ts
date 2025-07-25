import { z } from 'zod';

export const leadFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' })
});

export const websiteFormSchema = z.object({
  website: z.string().url({ message: 'Please enter a valid website URL' }),
  businessGoal: z.enum(['Leads', 'Sales', 'Awareness']).optional(),
  industry: z.string().optional(),
  runningAds: z.enum(['Yes', 'No']).optional()
});

export const formSchema = leadFormSchema.merge(websiteFormSchema);

export type LeadFormValues = z.infer<typeof leadFormSchema>;
export type WebsiteFormValues = z.infer<typeof websiteFormSchema>;
export type FormValues = z.infer<typeof formSchema>; 