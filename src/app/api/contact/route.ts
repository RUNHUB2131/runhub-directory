import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Send contact email
    try {
      const emailResult = await resend.emails.send({
        from: 'RunHub Directory <noreply@mail.runhub.co>',
        to: ['hello@runhub.co'],
        subject: `Contact Form: ${formData.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #021fdf; border-bottom: 2px solid #021fdf; padding-bottom: 10px;">
              Contact Form Submission
            </h1>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; margin-top: 0;">${formData.subject}</h2>
              <p><strong>From:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
            </div>

            <div style="margin: 20px 0;">
              <h3>Message:</h3>
              <div style="background-color: #f1f5f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
                ${formData.message}
              </div>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #666;">
              <p>This email was sent from the RunHub Directory contact form.</p>
              <p>Submitted at: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `,
        // Also include a plain text version
        text: `
Contact Form Submission

Subject: ${formData.subject}
From: ${formData.name} (${formData.email})

Message:
${formData.message}

Submitted at: ${new Date().toLocaleString()}
        `
      });

      console.log('Contact email sent successfully:', emailResult);

      return NextResponse.json({ 
        success: true, 
        message: 'Your message has been sent successfully. We\'ll get back to you soon!',
        emailId: emailResult.data?.id
      });

    } catch (emailError) {
      console.error('Email send error:', emailError);
      return NextResponse.json({ 
        error: 'Failed to send message. Please try again later.',
        details: emailError instanceof Error ? emailError.message : 'Unknown email error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ 
      error: 'Failed to process contact form',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 