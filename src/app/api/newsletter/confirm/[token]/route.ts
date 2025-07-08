import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    // Find and verify the signup
    const { data: signup, error } = await supabase
      .from('newsletter_signups')
      .select('*')
      .eq('verification_token', token)
      .eq('is_verified', false)
      .single();

    if (error || !signup) {
      return new NextResponse(getErrorHtml('Invalid or expired confirmation link'), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Update to verified
    const { error: updateError } = await supabase
      .from('newsletter_signups')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('id', signup.id);

    if (updateError) {
      return new NextResponse(getErrorHtml('Failed to confirm subscription'), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    return new NextResponse(getSuccessHtml(signup), {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Newsletter confirmation error:', error);
    return new NextResponse(getErrorHtml('Failed to process confirmation'), {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

function getSuccessHtml(signup: { first_name?: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Newsletter Subscription Confirmed - RUNHUB Directory</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px; 
            background-color: #f9fafb;
          }
          .success { color: #22c55e; }
          .card { 
            border: 1px solid #e5e7eb; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
            background-color: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .header {
            color: #021fdf;
            border-bottom: 2px solid #021fdf;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #021fdf;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 5px;
            font-weight: bold;
          }
          .button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <h1 class="header">RUNHUB Directory</h1>
        <div class="card">
          <h2 class="success">✅ Newsletter Subscription Confirmed!</h2>
          <p>Hi${signup.first_name ? ` ${signup.first_name}` : ''},</p>
          <p>Thanks for confirming your subscription to the RUNHUB Directory newsletter!</p>
          <p>You'll now receive updates about:</p>
          <ul>
            <li>New running clubs added to our directory</li>
            <li>Running events and community news</li>
            <li>Tips and resources for runners</li>
          </ul>
          
          <div style="margin-top: 20px;">
            <a href="${baseUrl}" class="button">Explore Running Clubs</a>
            <a href="${baseUrl}/all-clubs" class="button">Browse All Clubs</a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
          <p>Welcome to the RUNHUB Directory community!</p>
        </div>
      </body>
    </html>
  `;
}

function getErrorHtml(message: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Newsletter Confirmation Error - RUNHUB Directory</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px; 
            background-color: #f9fafb;
          }
          .error { color: #ef4444; }
          .card { 
            border: 1px solid #e5e7eb; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
            background-color: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .header {
            color: #021fdf;
            border-bottom: 2px solid #021fdf;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #021fdf;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 5px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1 class="header">RUNHUB Directory</h1>
        <div class="card">
          <h2 class="error">❌ Confirmation Error</h2>
          <p>${message}</p>
          <p>This could happen if:</p>
          <ul>
            <li>The confirmation link has expired</li>
            <li>You've already confirmed your subscription</li>
            <li>The link was copied incorrectly</li>
          </ul>
          
          <div style="margin-top: 20px;">
            <a href="${baseUrl}" class="button">Return to Homepage</a>
          </div>
        </div>
      </body>
    </html>
  `;
} 