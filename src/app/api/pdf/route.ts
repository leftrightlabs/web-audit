import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/lib/pdf';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { auditResult, userData } = body;

    // Validate required fields
    if (!auditResult || !userData) {
      return NextResponse.json(
        { success: false, message: 'Audit result and user data are required' },
        { status: 400 }
      );
    }

    try {
      // Generate PDF
      const pdf = generatePDF(auditResult, userData);

      // Convert PDF Blob to Base64
      const buffer = await pdf.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');

      return NextResponse.json({
        success: true,
        message: 'PDF generated successfully',
        data: {
          pdf: `data:application/pdf;base64,${base64}`,
        },
      });
    } catch (pdfError) {
      console.error('Error generating PDF:', pdfError);
      
      // If PDF generation fails or we're in development mode without proper setup,
      // return a fake PDF response for testing
      if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        console.log('Sending mock PDF data for testing');
        
        // This is just a minimal valid PDF in base64 for testing
        const mockPdfBase64 = 'JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PAovRmlsdGVyIC9GbGF0ZURlY29kZQovTGVuZ3RoIDM4Cj4+CnN0cmVhbQp4nCvkMlAwUDC1NNUzNVMoyeMyNDTUszQ3M7cwtDDWK8hLBwBjrAgRCmVuZHN0cmVhbQplbmRvYmoKNyAwIG9iago8PAovRmlsdGVyIC9GbGF0ZURlY29kZQovTGVuZ3RoIDY4Cj4+CnN0cmVhbQp4nCvk5VIwUMhOrUytKEnNS9ELSixJLUosKuZyKUgsScxLTy3SUM9LLSvmUkhOzEvOSC3KLy7RK8hLBwChNhGbCmVuZHN0cmVhbQplbmRvYmoKOCAwIG9iago8PAovRmlsdGVyIC9GbGF0ZURlY29kZQovTGVuZ3RoIDIxNAo+PgpzdHJlYW0KeJxdkMEKwjAMhu99ihy3Q5u0XStMd5i6g8wddJchmzbBixPfXlsFQSH5/y/5k+6A284qJPBOZsKAFq05u1gSLth7DURNTPFSWWDSHF2ZNEeiUnC3XSLMVhsHVVUAeWI5YUq4PcV4oCPQG2mSRbSo+7N6Hzq5L+EbZ0RFlZZQl6jfORzpdMZ0CWRLnZFq6oL8oXwymgpa2Wj3UdZYsP7+4HbvbJPr5C1bdMnliuHL+QWHAUwyCmVuZHN0cmVhbQplbmRvYmoKNCAwIG9iago8PAovVHlwZSAvUGFnZQovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Cj4+Ci9Db250ZW50cyBbNSAwIFIgNyAwIFIgOCAwIFJdCi9QYXJlbnQgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFs0IDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Cj4+CmVuZG9iagp4cmVmCjAgOQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDA2NTEgMDAwMDAgbiAKMDAwMDAwMDU5NiAwMDAwMCBuIAowMDAwMDAwNzAwIDAwMDAwIG4gCjAwMDAwMDA0ODMgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDAwIDAwMDAwIG4gCjAwMDAwMDAxMjEgMDAwMDAgbiAKMDAwMDAwMDI1NyAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDkKL1Jvb3QgMSAwIFIKL0luZm8gMyAwIFIKPj4Kc3RhcnR4cmVmCjcyMQolJUVPRgo=';
        
        return NextResponse.json({
          success: true,
          message: 'Mock PDF generated for testing',
          data: {
            pdf: `data:application/pdf;base64,${mockPdfBase64}`,
          },
        });
      }
      
      throw pdfError;
    }
  } catch (error: unknown) {
    console.error('Error in PDF generation API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate PDF';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
} 