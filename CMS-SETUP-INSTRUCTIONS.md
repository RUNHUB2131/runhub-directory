# RUNHUB Directory CMS Workflow Setup

This document explains how to set up the complete CMS workflow for club submissions and approvals.

## 🎯 Workflow Overview

1. **Club submits form** → Data saved to Supabase with `status: 'pending'`
2. **Email sent to admin** → Rich HTML email with club details + one-click approve/reject buttons
3. **Admin clicks approve** → Status updated to `approved`, club goes live, confirmation email sent to club owner
4. **Directory shows club** → Only approved clubs appear in public directory

## 📋 Setup Steps

### 1. Database Setup

Run the SQL in `supabase-schema-updated.sql` in your Supabase SQL Editor:

```sql
-- This will create the updated run_clubs table with approval workflow
-- Copy and paste the entire content of supabase-schema-updated.sql
```

This creates:
- Updated `run_clubs` table with new schema
- Approval workflow fields (`status`, `approval_token`, etc.)
- RLS policies (only approved clubs visible publicly)
- Automatic triggers for timestamps and approval tokens

### 2. Environment Variables

Copy `env-template.txt` to `.env.local` and fill in your values:

```bash
cp env-template.txt .env.local
```

**Required Variables:**
- `RESEND_API_KEY` - Your Resend API key (get from resend.com)
- `RUNHUB_ADMIN_EMAIL` - Email address that receives club submissions
- `NEXT_PUBLIC_APP_URL` - Your domain (for email links)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

### 3. Get Your Resend API Key

1. Go to [resend.com](https://resend.com)
2. Create an account
3. Create a new API key
4. Add it to your `.env.local` as `RESEND_API_KEY`

### 4. Test the Workflow

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Submit a test club:**
   - Go to `/add-club`
   - Fill out the form with test data
   - Submit the form

3. **Check your admin email:**
   - You should receive an email with club details
   - Click "APPROVE CLUB" to test one-click approval

4. **Verify approval:**
   - Check that the club appears in the directory
   - Club owner should receive a confirmation email

## 📧 Email Templates

The system sends two types of emails:

### Admin Notification Email
- Sent when a club is submitted
- Contains all club details
- Has one-click approve/reject buttons
- Links to approval endpoints

### Club Approval Email
- Sent to club owner when approved
- Welcomes them to the directory
- Provides link to their club page
- Includes next steps and tips

## 🔧 API Endpoints

### POST `/api/submit-club`
- Accepts club form data
- Validates required fields
- Saves to database with `status: 'pending'`
- Sends admin notification email
- Returns success/error response

### GET `/api/approve-club/[token]?action=approve|reject`
- One-click approval/rejection
- Updates club status in database
- Sends confirmation email to club owner (if approved)
- Returns HTML confirmation page

## 🚀 Deployment

When deploying to production:

1. **Set environment variables** in your hosting platform
2. **Update NEXT_PUBLIC_APP_URL** to your production domain
3. **Configure Resend domain** (optional, for custom sender domain)
4. **Test the workflow** with a real submission

## 🛠️ Customization

### Modify Email Templates
Edit the HTML templates in the API routes:
- `src/app/api/submit-club/route.ts` (admin notification)
- `src/app/api/approve-club/[token]/route.ts` (approval confirmation)

### Add More Admin Actions
You can extend the approval URL with query parameters:
- `?action=approve` - Approve the club
- `?action=reject&reason=spam` - Reject with reason

### Database Access
All clubs are stored in the `run_clubs` table with these statuses:
- `pending` - Awaiting approval
- `approved` - Live on directory
- `rejected` - Not shown publicly

## 🔍 Troubleshooting

### No emails received
- Check your `RESEND_API_KEY` is correct
- Verify `RUNHUB_ADMIN_EMAIL` is set
- Check spam folder
- Look at server logs for email errors

### Database errors
- Ensure you ran the schema update SQL
- Check your Supabase connection
- Verify RLS policies are set correctly

### Approval links not working
- Check `NEXT_PUBLIC_APP_URL` is correct
- Verify the approval token exists in database
- Ensure club status is still `pending`

## 🎉 You're Done!

Your RUNHUB Directory now has a complete CMS workflow! Club submissions will be automatically emailed to you for approval, and you can approve/reject with one click. 