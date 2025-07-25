export interface FormData {
  name: string;
  email: string;
  website: string;
  businessGoal?: string;
  industry?: string;
  runningAds?: string;
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