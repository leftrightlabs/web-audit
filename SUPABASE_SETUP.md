# Supabase Setup for Website Audit Tool

This document provides instructions on setting up Supabase for storing website audit form submissions.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com) if you don't already have one
2. Create a new project in Supabase

## Setup Steps

### 1. Get Your Supabase Credentials

After creating a project, go to your project settings and note down:

- **Project URL**: Found in Project Settings > API > URL
- **API Keys**: Found in Project Settings > API
  - **anon** public key (safe to use in the browser)
  - **service_role** key (for server-side only)

### 2. Create Environment Variables

Create or update your `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Create Database Tables

You can set up the database schema in one of two ways:

#### Option 1: Using the SQL Editor

1. In your Supabase dashboard, go to the "SQL Editor" section
2. Click "New query"
3. Copy and paste the contents of `supabase/schema.sql` from this project
4. Click "Run" to execute the SQL

#### Option 2: Using the Supabase UI

1. In your Supabase dashboard, go to the "Table Editor" section
2. Click "New Table"
3. Set the table name to `website_audits`
4. Add the following columns:

| Column Name        | Type      | Default Value | Primary | Is Nullable |
|--------------------|-----------|---------------|---------|-------------|
| id                 | uuid      | uuid_generate_v4() | Yes     | No          |
| name               | text      |               | No      | No          |
| email              | text      |               | No      | No          |
| website_url        | text      |               | No      | No          |
| goal               | text      |               | No      | Yes         |
| industry           | text      |               | No      | Yes         |
| audience_type      | text      |               | No      | Yes         |
| brand_personality  | text      |               | No      | Yes         |
| marketing_status   | text      |               | No      | Yes         |
| help_focus         | text      |               | No      | Yes         |
| created_at         | timestamp | now()         | No      | Yes         |

5. Click "Save" to create the table

### 4. Security Settings

For initial development:

1. Disable Row Level Security (RLS) by going to Authentication > Policies
2. Find the `website_audits` table and ensure RLS is turned off

For production:

1. Enable Row Level Security
2. Create a policy that allows inserts but restricts other operations, for example:
   - Policy name: "Allow inserts for everyone"
   - Policy definition: `FOR INSERT WITH CHECK (true)`

## Testing

After setup, your app should now store form submissions in Supabase. You can verify this by:

1. Submitting a form through your app
2. Going to the Supabase "Table Editor" section
3. Selecting the `website_audits` table
4. Checking that your submission appears in the table

## Troubleshooting

If you encounter issues:

1. Check your Supabase credentials in `.env.local`
2. Verify the table schema matches what's expected
3. Look at your browser console and server logs for errors
4. Check if Supabase is up by visiting your project dashboard 