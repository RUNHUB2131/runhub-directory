import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action'); // 'approve' or 'reject'
    const reason = searchParams.get('reason') || '';

    if (!action || !['approve', 'reject'].includes(action)) {
      return new NextResponse(getErrorHtml('Invalid action'), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Find club by approval token
    const { data: club, error: fetchError } = await supabase
      .from('run_clubs')
      .select('*')
      .eq('approval_token', token)
      .eq('status', 'pending')
      .single();

    if (fetchError || !club) {
      return new NextResponse(getErrorHtml('Club not found or already processed'), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Update club status
    const updateData: {
      status: string;
      approved_at: string;
      approved_by: string;
      rejection_reason?: string;
    } = {
      status: action === 'approve' ? 'approved' : 'rejected',
      approved_at: new Date().toISOString(),
      approved_by: 'admin', // You can enhance this with actual admin user
    };

    if (action === 'reject' && reason) {
      updateData.rejection_reason = reason;
    }

    const { error: updateError } = await supabase
      .from('run_clubs')
      .update(updateData)
      .eq('id', club.id);

    if (updateError) {
      return new NextResponse(getErrorHtml('Failed to update club status'), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Send confirmation email to club if approved
    if (action === 'approve') {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        await resend.emails.send({
          from: 'RunHub Directory <noreply@runhubdirectory.com.au>',
          to: [club.contact_email],
          subject: `Welcome to RunHub Directory - ${club.club_name} Approved!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #021fdf; border-bottom: 2px solid #021fdf; padding-bottom: 10px;">
                Welcome to RunHub Directory!
              </h1>
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #22c55e; margin-top: 0;">🎉 Club Approved!</h2>
                <p>Hi ${club.contact_name},</p>
                <p>Great news! <strong>${club.club_name}</strong> has been approved and is now live on RunHub Directory.</p>
              </div>
              <div style="margin: 20px 0;">
                <p>Your club is now visible to runners across Australia who are looking for their perfect running community.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${baseUrl}/clubs/${club.id}" style="background-color: #021fdf; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                    View Your Club Page
                  </a>
                </div>
              </div>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
        // Don't fail the approval if email fails
      }
    }

    // Return HTML response for one-click approval
    const html = getSuccessHtml(club, action);

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Approval error:', error);
    return new NextResponse(getErrorHtml('Failed to process approval'), {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

function getSuccessHtml(club: { id: string; club_name: string; contact_name: string; suburb_or_town: string; state: string }, action: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>RunHub Directory - Club ${action === 'approve' ? 'Approved' : 'Rejected'}</title>
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
          .warning { color: #f59e0b; }
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
        <h1 class="header">RunHub Directory Admin</h1>
        <div class="card">
          <h2 class="${action === 'approve' ? 'success' : 'warning'}">
            ${action === 'approve' ? '✅ Club Approved!' : '⚠️ Club Rejected'}
          </h2>
          <p><strong>Club:</strong> ${club.club_name}</p>
          <p><strong>Contact:</strong> ${club.contact_name}</p>
          <p><strong>Location:</strong> ${club.suburb_or_town}, ${club.state}</p>
          <p><strong>Status:</strong> ${action === 'approve' ? 'Approved and live on directory' : 'Rejected'}</p>
          ${action === 'approve' ? 
            `<p><strong>Club URL:</strong> <a href="${baseUrl}/clubs/${club.id}" target="_blank">${baseUrl}/clubs/${club.id}</a></p>
             <p style="color: #22c55e; font-weight: bold;">✓ Confirmation email sent to club owner</p>` : 
            `<p style="color: #f59e0b;">Club owner has not been notified automatically. You may want to send a personal message.</p>`
          }
          
          <div style="margin-top: 20px;">
            <a href="${baseUrl}/directory" class="button">View Directory</a>
            ${action === 'approve' ? 
              `<a href="${baseUrl}/clubs/${club.id}" class="button">View Club Page</a>` : 
              ''
            }
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
          <p>RunHub Directory Admin System</p>
          <p>Processed at ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `;
}

function getErrorHtml(message: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>RunHub Directory - Error</title>
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
        </style>
      </head>
      <body>
        <h1 class="header">RunHub Directory</h1>
        <div class="card">
          <h2 class="error">❌ Error</h2>
          <p>${message}</p>
          <p>Please contact support if this error persists.</p>
        </div>
      </body>
    </html>
  `;
} 