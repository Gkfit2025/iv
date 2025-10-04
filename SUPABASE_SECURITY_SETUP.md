# Supabase Security Configuration

## Steps to Complete Setup

### 1. Run the Security Fix SQL Script

Run the following script in your Supabase SQL Editor to fix the security warning:

\`\`\`sql
-- Already created in scripts/004_fix_security_warnings.sql
-- This adds proper search_path security to the handle_updated_at function
\`\`\`

### 2. Enable Leaked Password Protection

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/idsbrybxgzyixaeqqwvm
2. Navigate to **Authentication** → **Policies**
3. Find **Password Security** settings
4. Enable **"Check passwords against HaveIBeenPwned database"**
5. Save changes

This will prevent users from using compromised passwords that have been leaked in data breaches.

### 3. Configure Redirect URLs

Make sure your Supabase Auth settings include:

**Site URL:** `https://gkfiv.vercel.app`

**Redirect URLs:**
- `https://gkfiv.vercel.app/auth/callback` (for email verification)
- `https://v0.app/chat/api/supabase/redirect/lVkiffPYLzr` (for v0 development)

### 4. Email Verification Flow

The new auth callback route handles email verification properly:

1. User signs up → receives verification email
2. User clicks link → redirected to `/auth/callback?code=...`
3. Callback route exchanges code for session
4. User is redirected to dashboard with active session

### 5. Test the Flow

1. Sign up with a new email address
2. Check your email for verification link
3. Click the verification link
4. You should be redirected to the dashboard, logged in automatically

## Security Warnings Resolved

✅ **Function Search Path Mutable** - Fixed by adding `set search_path = public` to `handle_updated_at` function
⚠️ **Leaked Password Protection** - Needs to be enabled manually in Supabase Dashboard (see step 2 above)
