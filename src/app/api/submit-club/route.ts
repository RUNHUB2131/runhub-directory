import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Create service role client for storage operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate a unique slug for a club name
async function generateUniqueSlug(clubName: string): Promise<string> {
  // Convert to lowercase and replace spaces/special chars with hyphens
  const baseSlug = clubName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  let slug = baseSlug;
  let counter = 1;
  const maxAttempts = 10;

  // Check if slug exists, if so, add a number
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { data, error } = await supabase
      .from('run_clubs')
      .select('id')
      .eq('slug', slug)
      .single();

    if (error && error.code === 'PGRST116') {
      // No rows found, slug is unique
      return slug;
    }

    if (data) {
      // Slug exists, try with a number
      counter++;
      slug = `${baseSlug}-${counter}`;
    } else if (error) {
      // Some other error, log it but continue
      console.warn('Slug check error:', error);
      return slug;
    }
  }

  // If we've exhausted attempts, add a timestamp
  return `${baseSlug}-${Date.now()}`;
}

// Helper function to upload club photo to Supabase Storage
async function uploadClubPhoto(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    
    const { error } = await supabaseAdmin.storage
      .from('club-photos')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('club-photos')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadClubPhoto:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const clubName = formData.get('clubName') as string;
    const contactName = formData.get('contactName') as string;
    const shortBio = formData.get('shortBio') as string;
    const websiteUrl = formData.get('websiteUrl') as string;
    const instagramUrl = formData.get('instagramUrl') as string;
    const stravaUrl = formData.get('stravaUrl') as string;
    const additionalUrl = formData.get('additionalUrl') as string;
    const suburbOrTown = formData.get('suburbOrTown') as string;
    const postcode = formData.get('postcode') as string;
    const state = formData.get('state') as string;
    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;
    const clubType = formData.get('clubType') as string;
    const isPaid = formData.get('isPaid') as string;
    const leaderName = formData.get('leaderName') as string;
    const contactMobile = formData.get('contactMobile') as string;
    const contactEmail = formData.get('contactEmail') as string;
    
    // Parse JSON arrays
    const runSessions = JSON.parse(formData.get('runSessions') as string || '[]');
    const runDays = JSON.parse(formData.get('runDays') as string || '[]');
    const extracurriculars = JSON.parse(formData.get('extracurriculars') as string || '[]');
    const terrain = JSON.parse(formData.get('terrain') as string || '[]');
    
    // Get file
    const clubPhotoFile = formData.get('clubPhoto') as File | null;
    
    // Validate required fields
    if (!clubName || !contactName || !shortBio || 
        !suburbOrTown || !postcode || !state ||
        !latitude || !longitude || !contactEmail ||
        !leaderName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate that at least one valid run session exists
    const validRunSessions = runSessions?.filter((session: { day?: string; time?: string; location?: string; run_type?: string }) => 
      session.day && session.time && session.location && session.run_type
    ) || [];
    
    if (validRunSessions.length === 0) {
      return NextResponse.json({ error: 'At least one complete run session is required (day, time, location, and run type)' }, { status: 400 });
    }

    // Upload club photo if exists
    let clubPhotoUrl = null;
    if (clubPhotoFile) {
      clubPhotoUrl = await uploadClubPhoto(clubPhotoFile);
    }
    
    // Insert club into database with retry logic for slug conflicts
    let club;
    let insertAttempts = 0;
    const maxInsertAttempts = 3;
    
    while (insertAttempts < maxInsertAttempts) {
      // Generate/regenerate unique slug for each attempt
      const slug = await generateUniqueSlug(clubName);
      
      const { data, error } = await supabase
        .from('run_clubs')
        .insert({
          club_name: clubName,
          slug: slug,
          contact_name: contactName,
          short_bio: shortBio,
          website_url: websiteUrl || null,
          instagram_url: instagramUrl || null,
          strava_url: stravaUrl || null,
          additional_url: additionalUrl || null,
          suburb_or_town: suburbOrTown,
          postcode: postcode,
          state: state,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          run_details: [], // Keep empty array for backward compatibility
          run_sessions: validRunSessions,
          run_days: runDays,
          club_type: clubType,
          is_paid: isPaid,
          extracurriculars: extracurriculars,
          terrain: terrain,
          club_photo: clubPhotoUrl,
          leader_name: leaderName,
          contact_mobile: contactMobile || null,
          contact_email: contactEmail,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        // Check if it's a slug uniqueness constraint violation
        if (error.message.includes('run_clubs_slug_unique') && insertAttempts < maxInsertAttempts - 1) {
          console.warn(`Slug conflict on attempt ${insertAttempts + 1}, retrying...`);
          insertAttempts++;
          continue;
        }
        
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to submit club', details: error.message }, { status: 500 });
      }
      
      club = data;
      break;
    }
    
    if (!club) {
      console.error('Failed to insert club after all attempts');
      return NextResponse.json({ error: 'Failed to submit club after multiple attempts' }, { status: 500 });
    }

    // Send approval email to admin
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';
    const approveUrl = `${baseUrl}/api/approve-club/${club.approval_token}?action=approve`;
    const rejectUrl = `${baseUrl}/api/approve-club/${club.approval_token}?action=reject`;
    
    console.log('Attempting to send email...');
    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('Base URL:', baseUrl);
    console.log('Approval token:', club.approval_token);
    
    try {
      const emailResult = await resend.emails.send({
        from: 'RUNHUB Directory <noreply@mail.runhub.co>',
        to: ['hello@runhub.co'],
        subject: `New Club Submission: ${clubName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #021fdf; border-bottom: 2px solid #021fdf; padding-bottom: 10px;">
              New Club Submission
            </h1>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; margin-top: 0;">${clubName}</h2>
              <p><strong>Contact:</strong> ${contactName}</p>
              <p><strong>Leader:</strong> ${leaderName}</p>
              <p><strong>Email:</strong> ${contactEmail}</p>
              ${contactMobile ? `<p><strong>Mobile:</strong> ${contactMobile}</p>` : ''}
              <p><strong>Location:</strong> ${suburbOrTown}, ${state} ${postcode}</p>
              <p><strong>Club Type:</strong> ${clubType}</p>
              <p><strong>Cost:</strong> ${isPaid}</p>
            </div>

            <div style="margin: 20px 0;">
              <h3>Short Bio:</h3>
              <div style="background-color: #f1f5f9; padding: 15px; border-radius: 5px;">
                ${shortBio}
              </div>
            </div>

            ${validRunSessions.length > 0 ? `
              <div style="margin: 20px 0;">
                <h3>Run Sessions:</h3>
                ${validRunSessions.map((session: { day: string; time: string; location: string; run_type: string; distance?: string; description?: string }, index: number) => `
                  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                    <h4 style="margin: 0 0 10px 0; color: #333;">Session ${index + 1}</h4>
                    <p style="margin: 5px 0;"><strong>Day:</strong> ${session.day.charAt(0).toUpperCase() + session.day.slice(1)}</p>
                    <p style="margin: 5px 0;"><strong>Time:</strong> ${session.time}</p>
                    <p style="margin: 5px 0;"><strong>Location:</strong> ${session.location}</p>
                    <p style="margin: 5px 0;"><strong>Run Type:</strong> ${session.run_type}</p>
                    ${session.distance ? `<p style="margin: 5px 0;"><strong>Distance:</strong> ${session.distance}</p>` : ''}
                    ${session.description ? `<p style="margin: 5px 0;"><strong>Details:</strong> ${session.description}</p>` : ''}
                  </div>
                `).join('')}
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
              <p>This email was sent from RUNHUB Directory club submission system.</p>
              <p>Club ID: ${club.id}</p>
            </div>
          </div>
        `
      });
      
      console.log('Email sent successfully:', emailResult);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      console.error('Email error details:', JSON.stringify(emailError, null, 2));
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