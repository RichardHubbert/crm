# Customer Import Function

This project includes a Supabase Edge Function to receive and import customer data from other Supabase databases or external sources.

## Features

- **Secure Authentication**: Requires admin or data_importer role
- **Batch Processing**: Import multiple customers at once
- **Duplicate Detection**: Prevents duplicate imports using source IDs
- **Comprehensive Validation**: Validates data before import
- **Detailed Reporting**: Returns detailed results for each import
- **Two Import Modes**: Manual JSON import and direct database import

## Setup

### 1. Deploy the Edge Function

```bash
# Deploy the function to your Supabase project
supabase functions deploy receive-customer-data
```

### 2. Run the Database Migration

```bash
# Apply the migration to add import tracking fields
supabase db push
```

### 3. Set Up User Roles (Optional)

If you want to use the `data_importer` role, add it to your user_roles table:

```sql
-- Add data_importer role to a user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('your-user-id', 'data_importer');
```

## Usage

### Method 1: Manual JSON Import

Send customer data as JSON to the function:

```typescript
import { importCustomersFromDatabase } from '@/services/customerImportService';

const customerData = [
  {
    name: "Acme Corp",
    industry: "Technology",
    status: "Active",
    revenue: 1000000,
    email: "contact@acme.com",
    phone: "+1-555-0123",
    notes: "Imported from legacy system"
  }
];

const result = await importCustomersFromDatabase(customerData, "legacy-system");
console.log(result);
```

### Method 2: Direct Database Import

Import directly from another Supabase database:

```typescript
import { importCustomersFromSourceDatabase } from '@/services/customerImportService';

const result = await importCustomersFromSourceDatabase(
  "https://source-project.supabase.co",
  "source-anon-key",
  "source-database-id"
);
```

### Method 3: Using the React Component

Add the import form to your React application:

```tsx
import { CustomerImportForm } from '@/components/CustomerImportForm';

function CustomersPage() {
  const handleImportComplete = (result) => {
    console.log('Import completed:', result);
    // Refresh your customers list
  };

  return (
    <div>
      <h1>Customers</h1>
      <CustomerImportForm onImportComplete={handleImportComplete} />
      {/* Your existing customers list */}
    </div>
  );
}
```

## API Reference

### Edge Function Endpoint

**URL**: `https://your-project.supabase.co/functions/v1/receive-customer-data`

**Method**: `POST`

**Headers**:
- `Authorization`: `Bearer <user-jwt-token>`
- `Content-Type`: `application/json`

**Request Body**:
```json
{
  "customer_data": [
    {
      "name": "Customer Name",
      "industry": "Technology",
      "status": "Active",
      "revenue": 1000000,
      "email": "contact@customer.com",
      "phone": "+1-555-0123",
      "address": "123 Main St",
      "website": "https://customer.com",
      "notes": "Additional notes",
      "source_database_id": "legacy-system",
      "source_customer_id": "legacy-customer-123"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Processed 1 customers. 1 successful, 0 failed.",
  "results": [
    {
      "success": true,
      "customer_id": "new-uuid",
      "message": "Customer created successfully: Customer Name"
    }
  ],
  "summary": {
    "total": 1,
    "successful": 1,
    "failed": 0
  }
}
```

## Data Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Customer name |
| `industry` | string | No | Industry classification |
| `status` | string | No | Customer status (default: "Active") |
| `revenue` | number | No | Annual revenue |
| `email` | string | No | Contact email |
| `phone` | string | No | Contact phone |
| `address` | string | No | Physical address |
| `website` | string | No | Company website |
| `notes` | string | No | Additional notes |
| `source_database_id` | string | No | Identifier for source database |
| `source_customer_id` | string | No | Original customer ID from source |

## Security

- **Authentication Required**: All requests must include a valid JWT token
- **Role-Based Access**: Only users with `admin` or `data_importer` roles can import
- **Row Level Security**: Imported customers are assigned to the importing user
- **Input Validation**: All data is validated before processing

## Error Handling

The function provides detailed error messages for:

- Missing authentication
- Insufficient permissions
- Invalid data format
- Database errors
- Duplicate detection

## Database Schema Changes

The migration adds these fields to the `customers` table:

- `source_database_id`: Tracks the source database
- `source_customer_id`: Tracks the original customer ID
- `notes`: Additional notes field

## Troubleshooting

### Common Issues

1. **"Authorization header required"**
   - Ensure you're passing a valid JWT token
   - Check that the user is authenticated

2. **"Insufficient permissions"**
   - User must have `admin` or `data_importer` role
   - Add the role to the user_roles table

3. **"Invalid request body"**
   - Ensure customer_data is an array
   - Validate JSON format

4. **"Customer name is required"**
   - Each customer must have a non-empty name field

### Debug Mode

Enable debug logging by checking the function logs:

```bash
supabase functions logs receive-customer-data
```

## Example Integration

Here's a complete example of importing from a legacy system:

```typescript
// 1. Fetch data from legacy system
const legacyCustomers = await fetchLegacyCustomers();

// 2. Transform data to match our format
const transformedCustomers = legacyCustomers.map(customer => ({
  name: customer.company_name,
  industry: customer.sector,
  status: customer.is_active ? 'Active' : 'Inactive',
  revenue: customer.annual_revenue,
  email: customer.contact_email,
  phone: customer.contact_phone,
  source_database_id: 'legacy-crm',
  source_customer_id: customer.id.toString()
}));

// 3. Import to new system
const result = await importCustomersFromDatabase(transformedCustomers, 'legacy-crm');

// 4. Handle results
if (result.success) {
  console.log(`Imported ${result.summary.successful} customers successfully`);
} else {
  console.error('Import failed:', result.message);
}
```

## Support

For issues or questions:
1. Check the function logs: `supabase functions logs receive-customer-data`
2. Verify your authentication and permissions
3. Test with a small dataset first
4. Ensure your source database is accessible 