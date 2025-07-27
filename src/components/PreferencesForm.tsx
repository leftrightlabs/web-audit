import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { preferencesFormSchema, PreferencesFormValues } from '@/lib/schema';
import Button from './Button';

interface PreferencesFormProps {
  onSubmit: (data: PreferencesFormValues) => void;
  onBack: () => void;
  isLoading: boolean;
  defaultValues?: Partial<PreferencesFormValues>;
}

interface Question {
  id: keyof Omit<PreferencesFormValues, 'website'>;
  label: string;
  options: string[];
  required?: boolean;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({
  onSubmit,
  onBack,
  isLoading,
  defaultValues = {}
}) => {
  // Define all questions (excluding website field)
  const questions: Question[] = [
    {
      id: 'websiteGoal',
      label: "What's your primary goal for your website?",
      options: [
        'Generate leads',
        'Sell products',
        'Build brand awareness',
        'Book appointments',
        'Other'
      ]
    },
    {
      id: 'industryType',
      label: "What industry are you in?",
      options: [
        'Coaching / Consulting',
        'eCommerce / Retail',
        'SaaS / Tech',
        'Health & Wellness',
        'Creative / Portfolio',
        'Other'
      ]
    },
    {
      id: 'targetAudience',
      label: "Who is your target audience?",
      options: [
        'Consumers (B2C)',
        'Businesses (B2B)',
        'Nonprofits / Education',
        'I&apos;m not sure'
      ]
    },
    {
      id: 'brandPersonality',
      label: "How would you describe your brand\'s personality?",
      options: [
        'Professional & Polished',
        'Bold & Energetic',
        'Minimal & Modern',
        'Friendly & Approachable',
        'Luxurious & High-End'
      ]
    },
    {
      id: 'marketingCampaigns',
      label: "Are you currently running any marketing or ad campaigns?",
      options: [
        'Yes – Social Media Ads',
        'Yes – Google Ads',
        'No – Not yet',
        'Not sure'
      ]
    },
    {
      id: 'improvementArea',
      label: "What would you most like help improving?",
      options: [
        'Design / Visual Appeal',
        'Messaging / Copywriting',
        'SEO / Visibility',
        'Conversion / Lead Capture',
        'Overall Strategy'
      ]
    }
  ];

  // State to track current question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1); // -1 means website URL input
  const totalSteps = questions.length;
  const progress = ((currentQuestionIndex + 2) / (totalSteps + 1)) * 100; // +2 because we start at -1 and need to count the website URL step

  // Form setup
  const { register, handleSubmit, control, watch, formState: { errors }, setValue, /* getValues */ } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: { website: defaultValues.website || '', ...defaultValues }
  });
  
  const watchWebsite = watch('website');

  // Handle radio selection
  const handleRadioChange = (questionId: keyof Omit<PreferencesFormValues, 'website'>, value: string) => {
    // Cast value to the appropriate enum type
    setValue(questionId, value as PreferencesFormValues[typeof questionId]);
    if (currentQuestionIndex < questions.length - 1) {
      // Automatically advance to the next question
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Handle next and previous buttons
  /* 
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  */

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > -1) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      // Go back to previous form step
      onBack();
    }
  };

  // Handle form submission
  const onFormSubmit = (data: PreferencesFormValues) => {
    // Always allow form submission if the website URL is valid
    // (which is ensured by validation)
    console.log("Form submission triggered with data:", data);
    
    try {
      // Call the onSubmit prop with the data
      console.log("Calling parent onSubmit handler");
      onSubmit(data);
      console.log("Parent onSubmit handler called successfully");
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  // Check if we can proceed to questions
  const canProceedToQuestions = watchWebsite && watchWebsite.trim() !== '';

  // Handle Enter key on website field to proceed to questions
  const handleWebsiteKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canProceedToQuestions && currentQuestionIndex === -1) {
      e.preventDefault();
      setCurrentQuestionIndex(0);
    }
  };

  // Check if the current question has been answered
  const isCurrentQuestionAnswered = () => {
    if (currentQuestionIndex === -1) return canProceedToQuestions;
    if (currentQuestionIndex >= questions.length) return true;
    
    // All questions are optional, so always return true to allow skipping
    return true;
  };

  // Render the current question
  const renderCurrentQuestion = () => {
    // If we're on the website URL step
    if (currentQuestionIndex === -1) {
      return (
        <div className="py-4">
          <label htmlFor="website" className="block text-lg font-medium text-navy mb-3">
            Website URL <span className="text-purple">*</span>
          </label>
          <input
            id="website"
            type="url"
            {...register('website')}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            placeholder="https://example.com"
            onKeyPress={handleWebsiteKeyPress}
          />
          {errors.website && (
            <p className="mt-2 text-sm text-purple">{errors.website?.message}</p>
          )}
          <div className="mt-6">
            <Button 
              type="button" 
              variant="primary" 
              size="lg" 
              fullWidth
              disabled={!canProceedToQuestions}
              onClick={() => setCurrentQuestionIndex(0)}
            >
              Next
            </Button>
          </div>
        </div>
      );
    }

    // If we've finished all questions
    if (currentQuestionIndex >= questions.length) {
      return (
        <div className="py-4 text-center">
          <h3 className="font-heading text-2xl font-bold mb-4 text-navy">Ready to analyze your website!</h3>
          <p className="text-gray-600 mb-6">
            Thanks for providing this information. We&apos;ll use it to create a customized report for your website.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <Button 
              type="button" 
              variant="outline" 
              size="lg" 
              fullWidth 
              onClick={goToPreviousQuestion}
            >
              Back
            </Button>
            <Button 
              type="button" 
              variant="primary" 
              size="lg" 
              fullWidth 
              isLoading={isLoading}
              onClick={() => {
                // Simple version - just call the parent component's onSubmit directly
                const formValues = {
                  website: watch('website'),
                  websiteGoal: watch('websiteGoal'),
                  industryType: watch('industryType'),
                  targetAudience: watch('targetAudience'),
                  brandPersonality: watch('brandPersonality'),
                  marketingCampaigns: watch('marketingCampaigns'),
                  improvementArea: watch('improvementArea'),
                };
                // Call parent's onSubmit directly with form values
                onSubmit(formValues);
              }}
            >
              Review & Submit
            </Button>
          </div>
        </div>
      );
    }

    // For the questions
    const question = questions[currentQuestionIndex];
    
    return (
      <div className="py-4">
        <p className="text-sm text-purple font-medium mb-1">Question {currentQuestionIndex + 1} of {questions.length}</p>
        <label className="block text-lg font-medium text-navy mb-6">
          {question.label}
        </label>
        
        <Controller
          name={question.id}
          control={control}
          render={({ field }) => (
            <div className="space-y-3">
              {question.options.map((option) => (
                <label 
                  key={option} 
                  className={`group flex items-center p-4 border rounded-lg cursor-pointer transition-all 
                    ${field.value === option 
                      ? 'border-navy bg-navy text-white' 
                      : 'border-gray-200 hover:border-[#923a80] hover:bg-[#923a80] hover:text-white'}`}
                  onClick={() => handleRadioChange(question.id, option)}
                >
                  <input
                    type="radio"
                    value={option}
                    checked={field.value === option}
                    onChange={() => handleRadioChange(question.id, option)}
                    className="h-5 w-5 text-navy focus:ring-navy border-gray-300 sr-only"
                  />
                  <span className={`${field.value === option ? 'text-white' : 'text-gray-700'} group-hover:text-white`}>{option}</span>
                </label>
              ))}
            </div>
          )}
        />
        
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <Button 
            type="button" 
            variant="outline" 
            size="lg" 
            fullWidth 
            onClick={goToPreviousQuestion}
          >
            Back
          </Button>
          <Button 
            type="button" 
            variant={isCurrentQuestionAnswered() ? "primary" : "outline"} 
            size="lg" 
            fullWidth 
            onClick={isCurrentQuestionAnswered() ? 
              () => setCurrentQuestionIndex(currentQuestionIndex + 1) : 
              undefined}
            disabled={!isCurrentQuestionAnswered()}
          >
            {currentQuestionIndex === questions.length - 1 ? "Continue to Review" : "Skip / Continue"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-navy tracking-heading text-balance">Help us customize your report</h2>
        <p className="text-lg text-gray-600 text-balance">These details will help us tailor your website audit for better results</p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div 
          className="bg-gold h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 md:p-10 border border-gray-100">
        {/* Only use the form element for questions, not for the final review screen */}
        {currentQuestionIndex < questions.length ? (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onFormSubmit)(e);
            }}
            className="space-y-6"
            id="preferences-form"
          >
            {renderCurrentQuestion()}
            
            <p className="text-center text-xs text-gray-500 mt-6 text-balance">
              Website URL is required. All other questions are optional.
            </p>
          </form>
        ) : (
          <div className="space-y-6" id="preferences-review">
            {renderCurrentQuestion()}
            
            <p className="text-center text-xs text-gray-500 mt-6 text-balance">
              Website URL is required. All other questions are optional.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreferencesForm; 