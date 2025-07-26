import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { websiteFormSchema, WebsiteFormValues } from '@/lib/schema';
import Button from './Button';

interface WebsiteFormProps {
  onSubmit: (data: WebsiteFormValues) => void;
  onBack: () => void;
  isLoading: boolean;
  defaultValues?: Partial<WebsiteFormValues>;
}

const WebsiteForm: React.FC<WebsiteFormProps> = ({ 
  onSubmit, 
  onBack, 
  isLoading,
  defaultValues = {} 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WebsiteFormValues>({
    resolver: zodResolver(websiteFormSchema),
    defaultValues,
  });

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-navy tracking-heading text-balance">Website Details</h2>
        <p className="text-lg text-gray-600 text-balance">Enter your website URL and additional information to get a tailored analysis</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 md:p-10 border border-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-navy mb-2">
              Website URL <span className="text-purple">*</span>
            </label>
            <input
              id="website"
              type="url"
              {...register('website')}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              placeholder="https://example.com"
            />
            {errors.website && (
              <p className="mt-2 text-sm text-purple">{errors.website.message}</p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              size="lg" 
              fullWidth 
              onClick={onBack}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              fullWidth 
              isLoading={isLoading}
            >
              Analyze Website
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WebsiteForm; 