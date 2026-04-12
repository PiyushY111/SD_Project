# Expense Tracker — API Documentation

**Base URL:** `http://localhost:8000/api`
**Content-Type:** `application/json`
**Auth:** Protected routes use HttpOnly Cookies set automatically on login.

---

## Global Response Format

**Success**
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {}
}
```

**Error**
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error description",
    "details": []
  }
}
```

---

## 1. Authentication

### `POST /auth/register`
Register a new user. Sets an HttpOnly cookie on success.

**Request Body**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Validation Rules**
- `name` — required, max 50 chars
- `email` — required, valid email
- `password` — required, min 6 chars

**Response `201`**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "69db75d4c98481287a64ed12",
      "name": "Test User",
      "email": "test@example.com"
    }
  }
}
```

**Error `409`** — Email already registered
**Error `400`** — Validation failed

---

### `POST /auth/login`
Login. Sets an HttpOnly cookie named `token`.

**Request Body**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response `200`**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "69db75d4c98481287a64ed12",
      "name": "Test User",
      "email": "test@example.com"
    }
  }
}
```

**Error `401`** — Invalid email or password
**Error `400`** — Validation failed

---

### `GET /auth/logout`
Clears the auth cookie.

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
> Requires active session cookie

### `GET /categories`
Returns all global (predefined) categories plus the authenticated user's custom categories.

**Response `200`**
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "_id": "69d3480ff6252a713855c71a",
      "name": "Salary",
      "userId": null,
      "createdAt": "2026-04-06T05:43:43.333Z",
      "updatedAt": "2026-04-06T05:43:43.333Z"
    },
    {
      "_id": "69db78aac98481287a64ed1c",
      "name": "Side Hustle",
      "userId": "69db75d4c98481287a64ed12",
      "createdAt": "2026-04-12T10:49:14.367Z",
      "updatedAt": "2026-04-12T10:49:14.367Z"
    }
  ]
}
```

**Error `401`** — No token / invalid token

---

### `POST /categories`
Create a custom category for the authenticated user.

**Request Body**
```json
{
  "name": "Side Hustle"
}
```

**Validation Rules**
- `name` — required, max 50 chars

**Response `201`**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "69db78aac98481287a64ed1c",
    "name": "Side Hustle",
    "userId": "69db75d4c98481287a64ed12",
    "createdAt": "2026-04-12T10:49:14.367Z",
    "updatedAt": "2026-04-12T10:49:14.367Z"
  }
}
```

**Error `409`** — Category with this name already exists (case-insensitive, checks global + user's own)
**Error `400`** — Validation failed
**Error `401`** — No token / invalid token

---

## 3. Transactions
> Requires active session cookie

### `POST /transactions`
Create a new transaction.

**Request Body**
```json
{
  "amount": 8000,
  "type": "INCOME",
  "categoryId": "69d3480ff6252a713855c71a",
  "date": "2026-04-01",
  "description": "April salary"
}
```

**Validation Rules**
- `amount` — required, positive number
- `type` — required, `INCOME` or `EXPENSE`
- `categoryId` — required, valid MongoDB ObjectId
- `date` — optional, ISO8601 date string (defaults to now)
- `description` — optional string

**Response `201`**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "_id": "69db78d1c98481287a64ed24",
    "userId": "69db75d4c98481287a64ed12",
    "amount": 8000,
    "type": "INCOME",
    "categoryId": "69d3480ff6252a713855c71a",
    "date": "2026-04-01T00:00:00.000Z",
    "description": "April salary",
    "createdAt": "2026-04-12T10:49:53.387Z",
    "updatedAt": "2026-04-12T10:49:53.387Z"
  }
}
```

**Error `404`** — Category not found
**Error `403`** — Category belongs to another user
**Error `400`** — Validation failed
**Error `401`** — No token / invalid token

---

### `GET /transactions`
Get all transactions for the authenticated user. Supports optional filters.

**Query Parameters**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `startDate` | ISO8601 date | No | Filter from this date |
| `endDate` | ISO8601 date | No | Filter up to this date |
| `categoryId` | ObjectId | No | Filter by category |

**Response `200`**
```json
{
  "success": true,
  "message": "Transactions fetched successfully",
  "data": [
    {
      "_id": "69db78d1c98481287a64ed24",
      "userId": "69db75d4c98481287a64ed12",
      "amount": 8000,
      "type": "INCOME",
      "categoryId": {
        "_id": "69d3480ff6252a713855c71a",
        "name": "Salary"
      },
      "date": "2026-04-01T00:00:00.000Z",
      "description": "April salary",
      "createdAt": "2026-04-12T10:49:53.387Z",
      "updatedAt": "2026-04-12T10:49:53.387Z"
    }
  ]
}
```

**Error `401`** — No token / invalid token

---

### `PUT /transactions/:id`
Update an existing transaction. Only send fields you want to change.

**Request Body** (all fields optional)
```json
{
  "amount": 9000,
  "description": "Updated April salary"
}
```

**Response `200`**
```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "data": {
    "_id": "69db78d1c98481287a64ed24",
    "userId": "69db75d4c98481287a64ed12",
    "amount": 9000,
    "type": "INCOME",
    "categoryId": "69d3480ff6252a713855c71a",
    "date": "2026-04-01T00:00:00.000Z",
    "description": "Updated April salary",
    "createdAt": "2026-04-12T10:49:53.387Z",
    "updatedAt": "2026-04-12T10:52:16.982Z"
  }
}
```

**Error `404`** — Transaction not found
**Error `403`** — Not authorized to update this transaction
**Error `401`** — No token / invalid token

---

### `DELETE /transactions/:id`
Delete a transaction permanently.

**Response `200`**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

**Error `404`** — Transaction not found
**Error `403`** — Not authorized to delete this transaction
**Error `401`** — No token / invalid token

---

## 4. Reports
> Requires active session cookie

### `GET /reports/monthly`
Monthly summary — total income, total expense, and net balance.

**Query Parameters**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `month` | Integer (1–12) | Yes | Month number |
| `year` | Integer (1900–2100) | Yes | Year |

**Response `200`**
```json
{
  "success": true,
  "message": "Monthly report generated successfully",
  "data": {
    "month": 4,
    "year": 2026,
    "totalIncome": 9000,
    "totalExpense": 0,
    "net": 9000,
    "transactionCount": 1
  }
}
```

**Error `400`** — Validation failed (missing or invalid month/year)
**Error `401`** — No token / invalid token

---

### `GET /reports/category`
Spending and income broken down by category for a date range.

**Query Parameters**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `startDate` | ISO8601 date | No | Defaults to epoch (all time) |
| `endDate` | ISO8601 date | No | Defaults to now |

**Response `200`**
```json
{
  "success": true,
  "message": "Category report generated successfully",
  "data": {
    "startDate": "2026-01-01T00:00:00.000Z",
    "endDate": "2026-04-30T00:00:00.000Z",
    "categories": [
      {
        "categoryId": "69d3480ff6252a713855c71a",
        "categoryName": "Salary",
        "type": "INCOME",
        "total": 9000,
        "count": 1
      }
    ]
  }
}
```

**Error `400`** — Invalid date format
**Error `401`** — No token / invalid token
