# Manual Customer Import Instructions

Since the customer was created in the source database (`mxrrvqnfxfigeofbhepv`) but hasn't been imported to the target database (`nnxdtpnrwgcknhpyhowr`), you need to trigger the import manually.

## Option 1: Use the Application Interface (Recommended)

1. **Open your application** (the one connected to `nnxdtpnrwgcknhpyhowr`)
2. **Go to the Customers page**
3. **Look for an "Import" button** or "Import CSV" button
4. **Click on it** to open the import dialog
5. **Look for a "Database Import" or "Import from Database" option**
6. **Fill in the source database details:**
   - **Source Database URL**: `https://mxrrvqnfxfigeofbhepv.supabase.co`
   - **Source API Key**: Get this from your source database dashboard
   - **Source Database ID**: `mxrrvqnfxfigeofbhepv`
7. **Click "Import from Database"**

## Option 2: Get the Source API Key

To get the source API key:

1. **Go to**: https://supabase.com/dashboard/project/mxrrvqnfxfigeofbhepv
2. **Navigate to**: Settings > API
3. **Copy the "anon public" key**
4. **Use this key** in the import form

## Option 3: Use the Node.js Script

If the application interface doesn't work, you can use the provided script:

1. **Install dependencies** (if not already installed):
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Edit the script** `trigger-customer-import.js`:
   - Replace `YOUR_SOURCE_API_KEY` with the actual API key from step 2

3. **Log in to your application** first (to create a session)

4. **Run the script**:
   ```bash
   node trigger-customer-import.js
   ```

## Option 4: Direct SQL Import (Quick Fix)

If you just want to quickly get the customer into the target database:

1. **Go to the source database**: https://supabase.com/dashboard/project/mxrrvqnfxfigeofbhepv
2. **Run this SQL** to get the customer data:
   ```sql
   SELECT * FROM customers ORDER BY created_at DESC LIMIT 1;
   ```

3. **Go to the target database**: https://supabase.com/dashboard/project/nnxdtpnrwgcknhpyhowr
4. **Run this SQL** to insert the customer (replace with actual values):
   ```sql
   INSERT INTO customers (
     name, 
     industry, 
     status, 
     revenue, 
     user_id, 
     business_id,
     source_database_id,
     source_customer_id
   ) VALUES (
     'Customer Name', -- Replace with actual name
     'Industry',      -- Replace with actual industry
     'Active',        -- Replace with actual status
     0,               -- Replace with actual revenue
     'YOUR_USER_ID',  -- Replace with your user ID
     'YOUR_BUSINESS_ID', -- Replace with your business ID
     'mxrrvqnfxfigeofbhepv',
     'SOURCE_CUSTOMER_ID' -- Replace with actual source customer ID
   );
   ```

## What Happens After Import

Once the import is successful:
1. The customer will appear in your application
2. It will have the correct `business_id` association
3. You'll be able to see it due to RLS policies
4. The customer will be linked to your business

## Troubleshooting

- **"Authentication required"**: Make sure you're logged into your application first
- **"Insufficient permissions"**: Make sure your user has admin or data_importer role
- **"No customers found"**: Check that the source database actually has customers
- **"Import failed"**: Check the browser console or function logs for detailed error messages 