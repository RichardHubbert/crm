# Troubleshooting 500 Error on /admin/users

## Problem
Getting a 500 Internal Server Error when accessing `https://crmhubdesign.com/admin/users`

## Possible Causes & Solutions

### 1. Server Routing Configuration (Most Likely)

The 500 error is likely caused by the server not being configured to handle client-side routing for Single Page Applications (SPAs).

**Solution:** Add server configuration files based on your hosting platform:

#### For Netlify:
- Use the `_redirects` file (already created)
- Content: `/*    /index.html   200`

#### For Apache:
- Use the `.htaccess` file (already created)
- Contains rewrite rules for SPA routing

#### For Vercel:
- Use the `vercel.json` file (already created)
- Contains rewrites for all routes

#### For Nginx:
Add to your nginx configuration:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 2. Missing Database Function

The `is_admin` function might be missing from the database.

**Solution:** Run the SQL script in Supabase dashboard:
```sql
-- Create the missing is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND role = 'admin'
  );
END;
$$;
```

### 3. Supabase Connection Issues

Check if Supabase is accessible and the API key is valid.

**Solution:** 
- Verify the API key in `src/integrations/supabase/client.ts`
- Check if the Supabase project is active
- Test the connection in browser console

### 4. Client-Side Errors

JavaScript errors might be causing the page to fail.

**Solution:** 
- Check browser console for errors
- The ErrorBoundary component will catch and display errors
- Look for network request failures

## Debugging Steps

### Step 1: Check Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Navigate to `/admin/users`
4. Look for any error messages

### Step 2: Check Network Tab
1. Open browser developer tools (F12)
2. Go to Network tab
3. Navigate to `/admin/users`
4. Look for failed requests (red entries)

### Step 3: Test Direct Access
1. Try accessing `https://crmhubdesign.com/` (home page)
2. If home page works, the issue is with routing
3. If home page also fails, it's a server configuration issue

### Step 4: Check Server Logs
If you have access to server logs, look for:
- 404 errors for missing files
- 500 errors with stack traces
- Routing configuration issues

## Quick Fixes to Try

### 1. Clear Browser Cache
- Hard refresh (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache and cookies
- Try incognito/private mode

### 2. Check File Permissions
Ensure the server can read:
- `index.html`
- All files in the `dist` folder
- Server configuration files

### 3. Verify Build Output
Make sure the build was successful:
```bash
npm run build
```
Check that `dist/index.html` exists and contains the app.

## Contact Information

If the issue persists:
- Check server error logs
- Contact your hosting provider
- Verify server configuration for SPA routing

## Common Hosting Platform Configurations

### Netlify
- Uses `_redirects` file
- Should work automatically with the provided file

### Vercel
- Uses `vercel.json` file
- Should work automatically with the provided file

### Apache
- Uses `.htaccess` file
- Requires mod_rewrite to be enabled

### Nginx
- Requires manual configuration in server block
- Add try_files directive

### AWS S3 + CloudFront
- Configure CloudFront to serve `index.html` for 404s
- Set up error pages in CloudFront 