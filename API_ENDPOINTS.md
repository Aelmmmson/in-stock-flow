
# API Endpoints Documentation

This document outlines the API endpoints needed for production deployment of the Didiz Closet POS System.

## Base URL
```
https://api.didizcloset.com/v1
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication
```http
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET /auth/profile
PUT /auth/profile
```

### Branch Management
```http
GET /branches
POST /branches
GET /branches/{id}
PUT /branches/{id}
DELETE /branches/{id}
GET /branches/{id}/staff
GET /branches/{id}/products
GET /branches/{id}/transactions
GET /branches/{id}/reports
```

### Staff Management
```http
GET /staff
POST /staff
GET /staff/{id}
PUT /staff/{id}
DELETE /staff/{id}
PUT /staff/{id}/status
GET /staff/branch/{branchId}
```

### Products
```http
GET /products
POST /products
GET /products/{id}
PUT /products/{id}
DELETE /products/{id}
GET /products/search?q={query}
GET /products/category/{category}
GET /products/branch/{branchId}
GET /products/low-stock
POST /products/bulk-import
```

### Transactions
```http
GET /transactions
POST /transactions
GET /transactions/{id}
PUT /transactions/{id}
DELETE /transactions/{id}
GET /transactions/branch/{branchId}
GET /transactions/staff/{staffId}
GET /transactions/reports
```

### Expenses
```http
GET /expenses
POST /expenses
GET /expenses/{id}
PUT /expenses/{id}
DELETE /expenses/{id}
GET /expenses/branch/{branchId}
GET /expenses/category/{category}
```

### Reports
```http
GET /reports/financial
GET /reports/inventory
GET /reports/sales
GET /reports/branch/{branchId}/financial
GET /reports/branch/{branchId}/inventory
GET /reports/branch/{branchId}/sales
GET /reports/export/{type}
```

### Categories
```http
GET /categories
POST /categories
GET /categories/{id}
PUT /categories/{id}
DELETE /categories/{id}
```

### Discounts
```http
GET /discounts
POST /discounts
GET /discounts/{id}
PUT /discounts/{id}
DELETE /discounts/{id}
GET /discounts/active
```

### Business Information
```http
GET /business
PUT /business
```

### Notifications
```http
GET /notifications
POST /notifications
PUT /notifications/{id}/read
DELETE /notifications/{id}
```

### File Upload
```http
POST /upload/image
POST /upload/document
DELETE /upload/{fileId}
```

## Request/Response Examples

### Create Product
```http
POST /products
Content-Type: application/json

{
  "name": "Summer Dress",
  "sku": "DRESS-001",
  "category": "Dresses",
  "supplier": "Fashion Co.",
  "quantity": 10,
  "purchaseCost": 50.00,
  "sellingPrice": 100.00,
  "description": "Beautiful summer dress",
  "branchId": "branch-1",
  "lowStockThreshold": 5,
  "taxRate": 10,
  "taxInclusive": false
}
```

### Create Transaction
```http
POST /transactions
Content-Type: application/json

{
  "productId": "product-1",
  "quantity": 2,
  "originalPrice": 100.00,
  "actualPrice": 95.00,
  "totalAmount": 190.00,
  "type": "sale",
  "notes": "Customer discount",
  "branchId": "branch-1",
  "customer": "John Doe",
  "paymentMethod": "cash"
}
```

### Get Branch Report
```http
GET /reports/branch/branch-1/financial?startDate=2024-01-01&endDate=2024-12-31
```

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## Rate Limiting
- 1000 requests per hour per user
- 10000 requests per hour per branch (for owner accounts)

## Pagination
For endpoints returning lists, use:
```
GET /products?page=1&limit=20&sort=name&order=asc
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## Filtering
Most GET endpoints support filtering:
```
GET /transactions?type=sale&branchId=branch-1&startDate=2024-01-01&endDate=2024-12-31
```

## Data Backup
```http
GET /backup/full
POST /backup/restore
```

## Analytics
```http
GET /analytics/dashboard
GET /analytics/sales-trends
GET /analytics/inventory-turnover
GET /analytics/branch-performance
```
