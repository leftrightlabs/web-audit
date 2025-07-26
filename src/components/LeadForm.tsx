import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadFormSchema, LeadFormValues } from '@/lib/schema';
import Button from './Button';

interface LeadFormProps {
  onSubmit: (data: LeadFormValues) => void;
  isLoading: boolean;
  defaultValues?: Partial<LeadFormValues>;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, isLoading, defaultValues = {} }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues,
  });

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-navy tracking-heading text-balance">Let's Get Started</h2>
        <p className="text-lg text-gray-600 text-balance">Please provide your information to continue your free brand audit</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 md:p-10 border border-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-navy mb-2">
              Full Name <span className="text-purple">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              placeholder="John Smith"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-purple">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy mb-2">
              Email Address <span className="text-purple">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-purple">{errors.email.message}</p>
            )}
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              fullWidth 
              isLoading={isLoading}
            >
              Continue
            </Button>
          </div>
          
          <p className="text-center text-xs text-gray-500 mt-6 text-balance">
            Your information is secure and will never be shared with third parties.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LeadForm; 