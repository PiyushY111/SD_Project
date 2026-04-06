# Expense Tracker — Full API Documentation

**Base URL:** `http://localhost:8000/api`  
**Content-Type:** `application/json`  
**Auth:** Protected routes now use **HttpOnly Cookies** automatically.

---

## Global Response Standard

All API requests return a consistent JSON wrapper.

**Success format:**
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { /* Optional response payload */ }
}
```

**Error format:**
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error description",
    "details": [ /* Optional array of validation errors */ ]
  }
}
```

---

## 1. Authentication

### `POST /auth/register`
Register a new user account. On success, sets an `HttpOnly` cookie.

**Request Body**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Response `201`** *(Plus `Set-Cookie` header)*
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "6613a2f3e4b0d2a1c8e9f001",
      "name": "Test User",
      "email": "test@example.com"
    }
  }
}
```

---

### `POST /auth/login`
Login. On success, sets an `HttpOnly` cookie named `token`.

**Request Body**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response `200`** *(Plus `Set-Cookie` header)*
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "6613a2f3e4b0d2a1c8e9f001",
      "name": "Test User",
      "email": "test@example.com"
    }
  }
}
```

---

### `GET /auth/logout`
Logs the user out by clearing the HttpOnly cookie.

**Response `200`**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": {}
}
```

---

## 2. Categories
> 🔒 Requires active session cookie

### `GET /categories`
Get all categories — predefined global ones + your custom ones.

**Response `200`**
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "_id": "6613b1aae4b0d2a1c8e9f010",
      "name": "Salary",
      "userId": null
    }
  ]
}
```

### `POST /categories`
Create a custom category for your account.

**Request Body**
```json
{
  "name": "Side Hustle"
}
```

**Response `201`**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "6613c9f0e4b0d2a1c8e9f099",
    "name": "Side Hustle",
    "userId": "6613a2f3e4b0d2a1c8e9f001"
  }
}
```

---

## 3. Transactions
> 🔒 Requires active session cookie

### `POST /transactions`
Add a new income or expense transaction.

**Request Body**
```json
{
  "amount": 8000,
  "type": "INCOME",
  "categoryId": "6613b1aae4b0d2a1c8e9f010",
  "date": "2026-04-01",
  "description": "April salary"
}
```

**Response `201`**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "_id": "6613d0ffe4b0d2a1c8e9f200",
    "userId": "6613a2f3e4b0d2a1c8e9f001",
    "amount": 8000,
    "type": "INCOME",
    "categoryId": "6613b1aae4b0d2a1c8e9f010",
    "date": "2026-04-01T00:00:00.000Z",
    "description": "April salary"
  }
}
```

---

### `GET /transactions`
Get all your transactions with optional filters.

**Query Parameters**
| Param | Type | Required |
|-------|------|----------|
| `startDate` | Date string | ❌ |
| `endDate` | Date string | ❌ |
| `categoryId` | ObjectId | ❌ |

**Response `200`**
```json
{
  "success": true,
  "message": "Transactions fetched successfully",
  "data": [
    {
      "_id": "6613d0ffe4b0d2a1c8e9f200",
      "amount": 8000,
      "type": "INCOME",
      "categoryId": {
        "_id": "6613b1aae4b0d2a1c8e9f010",
        "name": "Salary"
      },
      "date": "2026-04-01T00:00:00.000Z",
      "description": "April salary"
    }
  ]
}
```

---

### `PUT /transactions/:id`
Update an existing transaction. Send only the fields to change.

**Request Body** *(all fields optional)*
```json
{
  "amount": 6000,
  "description": "Updated salary entry"
}
```

### `DELETE /transactions/:id`
Delete a transaction permanently.

---

## 4. Reports
> 🔒 Requires active session cookie

### `GET /reports/monthly`
Monthly summary — total income, total expense, and net balance.

**Query Parameters** (Both required)
| Param | Type | Required |
|-------|------|----------|
| `month` | Number | ✅ |
| `year` | Number | ✅ |

### `GET /reports/category`
Spending and income broken down by category.

**Query Parameters**
| Param | Type | Required |
|-------|------|----------|
| `startDate` | Date string | ❌ |
| `endDate` | Date string | ❌ |
