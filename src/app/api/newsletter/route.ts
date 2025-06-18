import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Simple newsletter signup - no rate limiting needed

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';
    
    // Simple bot protection - only honeypot fields if they exist
    if (formData.website || formData.url || formData.phone) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    // Validate required fields
    if (!formData.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Basic email validation only
    const email = formData.email.toLowerCase();

    // Insert into database
    const { error } = await supabase
      .from('newsletter_signups')
      .insert({
        email: email,
        first_name: formData.firstName || null,
        source: formData.source || 'unknown',
        ip_address: clientIP,
        user_agent: userAgent,
        is_verified: true  // Simple signup, no verification needed
      })
      .select()
      .single();

    if (error) {
      // Handle duplicate email gracefully
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ 
          success: true, 
          message: 'Thanks! You\'re already subscribed to our newsletter.',
          alreadyExists: true
        });
      }
      
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to subscribe to newsletter' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Thanks for subscribing! You\'ll receive updates about new running clubs.'
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ 
      error: 'Failed to process newsletter signup',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 