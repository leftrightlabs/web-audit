# Website Brand Audit Tool

A standalone, AI-powered lead magnet web application that provides users with a free website brand audit. The application captures leads (name and email) and delivers value by analyzing websites and generating actionable insights in a downloadable report.

## Features

- Multi-step form process with progress indicators
- Integration with ActiveCampaign for lead capture
- Website analysis using OpenAI GPT-4
- Downloadable PDF reports with branding insights
- Email delivery of reports

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- OpenAI API
- ActiveCampaign API
- PDF generation with jsPDF

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- ActiveCampaign account with API credentials

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd web-audit
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file based on the example:

```bash
cp .env.local.example .env.local
```

4. Update the environment variables in `.env.local` with your API keys and configuration.

5. Add the Better Vinegar Bold font to the `/public/fonts/` directory.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `ACTIVECAMPAIGN_API_URL`: Your ActiveCampaign API URL (e.g., https://your-account.api-us1.com)
- `ACTIVECAMPAIGN_API_KEY`: Your ActiveCampaign API key
- `AC_FIELD_*`: IDs for ActiveCampaign custom fields
- `AC_LIST_BRAND_AUDIT`: ID for the ActiveCampaign list for brand audit leads
- `EMAIL_*`: Configuration for email sending

## Project Structure

- `/src/app`: Next.js App Router files and API routes
- `/src/components`: React components for the UI
- `/src/lib`: Utility functions and service integrations
- `/src/types`: TypeScript type definitions
- `/src/utils`: Helper functions

## License

This project is private and confidential. Unauthorized distribution is prohibited.
