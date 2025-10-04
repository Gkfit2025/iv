# Email Notifications Setup Guide

This application includes email notification functionality for:
- Welcome emails when users sign up
- Application confirmation emails
- Application status update emails (approved/rejected)

## Current Status

The email system is **configured but not yet connected** to a real email service. Email templates are ready and the code is in place, but emails will only be logged to the console until you complete the setup below.

## Setup Instructions

### Option 1: Resend (Recommended)

Resend is a modern email API that's easy to set up and works great with Next.js.

1. **Create a Resend account**
   - Go to [resend.com](https://resend.com)
   - Sign up for a free account

2. **Get your API key**
   - Go to API Keys in your Resend dashboard
   - Create a new API key
   - Copy the key

3. **Add to your project**
   - In your Vercel project settings, add environment variable:
     - `RESEND_API_KEY` = your API key
   - Add your sending domain:
     - `NEXT_PUBLIC_APP_URL` = your app URL (e.g., https://yourapp.vercel.app)

4. **Install Resend package**
   \`\`\`bash
   npm install resend
   \`\`\`

5. **Update lib/email.ts**
   - Uncomment the Resend implementation code
   - Update the "from" email address to match your verified domain

### Option 2: Other Email Services

You can also use:
- **SendGrid**: Popular email service with good free tier
- **AWS SES**: Cost-effective for high volume
- **Postmark**: Great for transactional emails

Update the `sendEmail` function in `lib/email.ts` to use your preferred service.

## Email Templates

The following email templates are included:

1. **Welcome Email** (`getWelcomeEmail`)
   - Sent when users sign up
   - Includes getting started guide

2. **Application Confirmation** (`getApplicationConfirmationEmail`)
   - Sent when users submit an application
   - Confirms receipt and next steps

3. **Application Status Update** (`getApplicationStatusEmail`)
   - Sent when application status changes
   - Different templates for approved/rejected

## Testing Emails

Before going live, test your emails:

1. Use your own email address
2. Check spam folders
3. Test on mobile and desktop
4. Verify all links work correctly

## Production Checklist

- [ ] Email service configured (Resend, SendGrid, etc.)
- [ ] API keys added to environment variables
- [ ] Sending domain verified
- [ ] "From" email address updated
- [ ] Test emails sent successfully
- [ ] Links in emails work correctly
- [ ] Emails render well on mobile
- [ ] Unsubscribe functionality added (if required)
