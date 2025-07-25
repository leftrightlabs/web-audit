import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, website, pdfBase64 } = body;

    // Validate required fields
    if (!email || !pdfBase64) {
      return NextResponse.json(
        { success: false, message: 'Email and PDF data are required' },
        { status: 400 }
      );
    }

    // Check if email configuration is available or if we're in mock mode
    if (!process.env.EMAIL_USER || 
        !process.env.EMAIL_PASS ||
        process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      
      console.log('Using mock mode for email. Email info:', {
        to: email,
        subject: `Your Website Brand Audit for ${website}`,
        recipient: name
      });
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      return NextResponse.json({
        success: true,
        message: 'Email sending simulated in mock mode',
      });
    }

    // Get email configuration from environment variables
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const emailPort = parseInt(process.env.EMAIL_PORT || '587', 10);

    if (!emailUser || !emailPass) {
      return NextResponse.json(
        { success: false, message: 'Email configuration is not set' },
        { status: 500 }
      );
    }

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailPort === 465,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Extract base64 data from data URL
    const pdfData = pdfBase64.split(';base64,').pop();

    // Set up email options
    const mailOptions = {
      from: `"Website Brand Audit" <${emailUser}>`,
      to: email,
      subject: `Your Website Brand Audit for ${website}`,
      text: `
Hello ${name},

Thank you for using our Website Brand Audit tool! 

We've analyzed your website (${website}) and attached a comprehensive brand audit report with actionable insights and recommendations to improve your online presence.

If you have any questions about the report or would like further assistance, please don't hesitate to reply to this email.

Best regards,
Website Brand Audit Team
      `,
      attachments: [
        {
          filename: `${website.replace(/^https?:\/\//, '').replace(/\/$/, '')}-brand-audit.pdf`,
          content: Buffer.from(pdfData, 'base64'),
          contentType: 'application/pdf',
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'PDF report sent successfully to your email',
    });
  } catch (error: any) {
    console.error('Error sending PDF by email:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
} 