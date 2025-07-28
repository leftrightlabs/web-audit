/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import BrandAuditPDF from '@/components/BrandAuditPDF';

export async function GET() {
  try {
    console.log('Testing PDF generation...');
    
    // Mock data for testing
    const mockAuditResult = {
      summary: "This is a test summary for the brand audit. Your website shows good potential but needs some improvements in design and content strategy.",
      strengths: ["Good domain name", "Clear business purpose"],
      weaknesses: ["Needs better design", "Content could be improved"],
      actionableSteps: ["Redesign the homepage", "Improve content quality", "Add more CTAs"],
      improvements: ["Better color scheme", "More engaging copy"],
      isMockData: true
    };

    const mockUserData = {
      website: "test.com",
      name: "Test User",
      email: "test@example.com"
    };

    // Generate PDF using React PDF renderer
    const pdfBuffer = await renderToBuffer(
      React.createElement(BrandAuditPDF, {
        auditResult: mockAuditResult,
        userData: mockUserData,
        lighthouseData: null,
      }) as any
    );

    console.log('Test PDF buffer generated, size:', pdfBuffer.length);
    
    // Return the PDF directly
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="test-brand-audit.pdf"',
      },
    });
  } catch (error) {
    console.error('Error in test PDF generation:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate test PDF' },
      { status: 500 }
    );
  }
} 