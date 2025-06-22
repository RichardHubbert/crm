# Supabase Project Setup Guide

## Current Issue
The application is getting "Invalid API key" errors because we're trying to use an API key from project `nnxdtpnrwgcknhpyhowr` with project `nxiejogrelqxxkyhcwgi`.

## How to Fix This

### Option 1: Get API Key for Project `nxiejogrelqxxkyhcwgi`

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in to your account

2. **Select the Correct Project**
   - Look for project ID: `nxiejogrelqxxkyhcwgi`
   - Click on it to open the project

3. **Get the API Keys**
   - Go to **Settings** → **API**
   - Copy the **anon public** key (this is the publishable key)
   - Copy the **service_role** key (for edge functions)

4. **Update the Application**
   - Replace the API key in `src/integrations/supabase/client.ts`
   - Update the project URL to: `https://nxiejogrelqxxkyhcwgi.supabase.co`
   - Update edge function URLs in services

### Option 2: Use the Working Project

If you want to continue using the working project `nnxdtpnrwgcknhpyhowr`:

1. **Update the config**
   - Change `supabase/config.toml` to use project ID: `nnxdtpnrwgcknhpyhowr`
   - Deploy edge functions to this project

2. **Keep current API keys**
   - The current API key is valid for this project
   - No changes needed to the client code

## Current Configuration

**Working Project (current):**
- URL: `https://nnxdtpnrwgcknhpyhowr.supabase.co`
- API Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ueGR0cG5yd2dja25ocHlob3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxODU3NDYsImV4cCI6MjA1NDc2MTc0Nn0.vtNzW7hrDrgSaTHWg37nCOLPnFp_khWSOMp6GVQS1rY`

**Target Project (needs API key):**
- URL: `https://nxiejogrelqxxkyhcwgi.supabase.co`
- API Key: [NEED TO GET FROM DASHBOARD]

## Files to Update

If you choose Option 1, update these files:
- `src/integrations/supabase/client.ts`
- `src/services/userService.ts`
- `src/components/AdminUsersTable.tsx`
- `supabase/config.toml`

## Next Steps

1. Decide which project to use
2. Get the correct API keys
3. Update the configuration
4. Test authentication
5. Deploy edge functions if needed 