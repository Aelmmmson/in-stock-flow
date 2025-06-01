
# API Endpoints

This document outlines the API endpoints available in the Didiz Closet inventory management system.

## Authentication Endpoints

### POST /api/auth/login
- **Description**: Authenticate user and create session
- **Body**: `{ email: string, password: string }`
- **Response**: `{ user: User, token: string }`

### POST /api/auth/logout
- **Description**: End user session
- **Response**: `{ success: boolean }`

## Inventory Endpoints

### GET /api/inventory
- **Description**: Retrieve all products
- **Query Parameters**: 
  - `category`: Filter by category
  - `search`: Search by name or SKU
  - `branch`: Filter by branch ID
- **Response**: `Product[]`

### POST /api/inventory
- **Description**: Create new product
- **Body**: `Omit<Product, 'id' | 'createdAt' | 'updatedAt'>`
- **Response**: `Product`

### PUT /api/inventory/:id
- **Description**: Update existing product
- **Body**: `Partial<Product>`
- **Response**: `Product`

### DELETE /api/inventory/:id
- **Description**: Delete product
- **Response**: `{ success: boolean }`

## Transaction Endpoints

### GET /api/transactions
- **Description**: Retrieve all transactions
- **Query Parameters**:
  - `type`: Filter by transaction type (sale, purchase, adjustment)
  - `branch`: Filter by branch ID
  - `startDate`: Filter from date
  - `endDate`: Filter to date
- **Response**: `Transaction[]`

### POST /api/transactions
- **Description**: Create new transaction
- **Body**: `Omit<Transaction, 'id' | 'createdAt'>`
- **Response**: `Transaction`

### GET /api/transactions/:id
- **Description**: Get specific transaction
- **Response**: `Transaction`

## Branch Management Endpoints

### GET /api/branches
- **Description**: Retrieve all branches
- **Response**: `Branch[]`

### POST /api/branches
- **Description**: Create new branch
- **Body**: `Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>`
- **Response**: `Branch`

### PUT /api/branches/:id
- **Description**: Update branch
- **Body**: `Partial<Branch>`
- **Response**: `Branch`

### DELETE /api/branches/:id
- **Description**: Delete branch
- **Response**: `{ success: boolean }`

## Staff Management Endpoints

### GET /api/staff
- **Description**: Retrieve all staff members
- **Response**: `Staff[]`

### POST /api/staff
- **Description**: Add new staff member
- **Body**: `Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>`
- **Response**: `Staff`

### PUT /api/staff/:id
- **Description**: Update staff member
- **Body**: `Partial<Staff>`
- **Response**: `Staff`

### DELETE /api/staff/:id
- **Description**: Remove staff member
- **Response**: `{ success: boolean }`

## Discount Endpoints

### GET /api/discounts
- **Description**: Retrieve all discounts
- **Response**: `Discount[]`

### POST /api/discounts
- **Description**: Create new discount
- **Body**: `Omit<Discount, 'id' | 'createdAt' | 'updatedAt'>`
- **Response**: `Discount`

### PUT /api/discounts/:id
- **Description**: Update discount
- **Body**: `Partial<Discount>`
- **Response**: `Discount`

### DELETE /api/discounts/:id
- **Description**: Delete discount
- **Response**: `{ success: boolean }`

## Reports Endpoints

### GET /api/reports/financial
- **Description**: Get financial reports
- **Query Parameters**:
  - `startDate`: Report start date
  - `endDate`: Report end date
  - `branch`: Branch ID
- **Response**: `FinancialReport`

### GET /api/reports/inventory
- **Description**: Get inventory reports
- **Response**: `InventoryReport`

### GET /api/reports/sales
- **Description**: Get sales reports
- **Query Parameters**:
  - `startDate`: Report start date
  - `endDate`: Report end date
  - `branch`: Branch ID
- **Response**: `SalesReport`

## Response Format

All API responses follow this format:

```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "error": string | null
}
```

## Error Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error
