import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Validate required fields
    if (!formData.clubName || !formData.contactName || !formData.shortBio || 
        !formData.suburbOrTown || !formData.postcode || !formData.state ||
        !formData.latitude || !formData.longitude || !formData.contactEmail ||
        !formData.leaderName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload club photo if exists (placeholder for now)
    let clubPhotoUrl = null;
    if (formData.clubPhoto) {
      // TODO: Implement file upload to Supabase Storage
      // clubPhotoUrl = await uploadClubPhoto(formData.clubPhoto);
    }
    
    // Insert club into database
    const { data: club, error } = await supabase
      .from('run_clubs')
      .insert({
        club_name: formData.clubName,
        contact_name: formData.contactName,
        short_bio: formData.shortBio,
        website_url: formData.websiteUrl || null,
        instagram_url: formData.instagramUrl || null,
        strava_url: formData.stravaUrl || null,
        additional_url: formData.additionalUrl || null,
        suburb_or_town: formData.suburbOrTown,
        postcode: formData.postcode,
        state: formData.state,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        run_details: formData.runDetails.filter((detail: string) => detail.trim() !== ''),
        run_days: formData.runDays,
        club_type: formData.clubType,
        is_paid: formData.isPaid,
        extracurriculars: formData.extracurriculars,
        terrain: formData.terrain,
        club_photo: clubPhotoUrl,
        leader_name: formData.leaderName,
        contact_mobile: formData.contactMobile || null,
        contact_email: formData.contactEmail,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to submit club', details: error.message }, { status: 500 });
    }

    // Send approval email to admin
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const approveUrl = `${baseUrl}/api/approve-club/${club.approval_token}?action=approve`;
    const rejectUrl = `${baseUrl}/api/approve-club/${club.approval_token}?action=reject`;
    
    try {
      await resend.emails.send({
        from: 'RunHub Directory <noreply@runhubdirectory.com.au>',
        to: [process.env.RUNHUB_ADMIN_EMAIL!],
        subject: `New Club Submission: ${formData.clubName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #021fdf; border-bottom: 2px solid #021fdf; padding-bottom: 10px;">
              New Club Submission
            </h1>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; margin-top: 0;">${formData.clubName}</h2>
              <p><strong>Contact:</strong> ${formData.contactName}</p>
              <p><strong>Leader:</strong> ${formData.leaderName}</p>
              <p><strong>Email:</strong> ${formData.contactEmail}</p>
              ${formData.contactMobile ? `<p><strong>Mobile:</strong> ${formData.contactMobile}</p>` : ''}
              <p><strong>Location:</strong> ${formData.suburbOrTown}, ${formData.state} ${formData.postcode}</p>
              <p><strong>Club Type:</strong> ${formData.clubType}</p>
              <p><strong>Cost:</strong> ${formData.isPaid}</p>
            </div>

            <div style="margin: 20px 0;">
              <h3>Short Bio:</h3>
              <div style="background-color: #f1f5f9; padding: 15px; border-radius: 5px;">
                ${formData.shortBio}
              </div>
            </div>

            ${formData.runDays.length > 0 ? `
              <div style="margin: 20px 0;">
                <h3>Run Days:</h3>
                                 <p>${formData.runDays.map((day: string) => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}</p>
              </div>
            ` : ''}

            <div style="margin: 30px 0; text-align: center;">
              <a href="${approveUrl}" style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-right: 10px; display: inline-block; font-weight: bold;">
                ✅ APPROVE CLUB
              </a>
              
              <a href="${rejectUrl}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                ❌ REJECT CLUB
              </a>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #666;">
              <p>This email was sent from RunHub Directory club submission system.</p>
              <p>Club ID: ${club.id}</p>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail the submission if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Club submitted successfully and is pending approval',
      clubId: club.id 
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Failed to submit club' }, { status: 500 });
  }
} 