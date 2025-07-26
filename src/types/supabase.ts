export interface WebsiteAudit {
  id: string;
  name: string;
  email: string;
  website_url: string;
  goal: string | null;
  industry: string | null;
  audience_type: string | null;
  brand_personality: string | null;
  marketing_status: string | null;
  help_focus: string | null;
  created_at: string; // ISO date string
}

export type WebsiteAuditInsert = Omit<WebsiteAudit, 'id' | 'created_at'>;

// Define Supabase database schema for type safety
export interface Database {
  public: {
    Tables: {
      website_audits: {
        Row: WebsiteAudit;
        Insert: WebsiteAuditInsert;
        Update: Partial<WebsiteAuditInsert>;
      };
      // Add more tables as needed
    };
  };
} 