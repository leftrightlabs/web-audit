import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import CookieConsentWrapper from "@/components/CookieConsentWrapper";

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Free Website Brand Audit | Improve Your Online Presence",
  description: "Get a free AI-powered brand audit of your website. Receive actionable insights to improve your online presence, branding, and messaging.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={workSans.variable}>
      <body>
        {children}
        <CookieConsentWrapper />
      </body>
    </html>
  );
}
