# MoneyMatters — Multi-User Expense Tracking System

A RESTful backend API for tracking personal income and expenses, built with the MERN stack (minus the frontend). Supports multi-user authentication, categorized transactions, and financial reporting.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v4 |
| Database | MongoDB (via Mongoose v8) |
| Authentication | JWT (HttpOnly Cookies + Bearer Token) |
| Validation | express-validator v7 |
| Password Hashing | bcryptjs |
| Environment Config | dotenv |
| Dev Server | nodemon |

---

## Project Structure

```
backend/
├── seed.js                 # Seeds predefined global categories into DB
├── src/
│   ├── server.js           # Entry point — starts HTTP server, connects to DB
│   ├── app.js              # Express app setup, routes, middleware, error handler
│   ├── config/
│   │   └── db.js           # Singleton MongoDB connection (Singleton Pattern)
│   ├── models/
│   │   ├── user.model.js       # User schema with password hashing hooks
│   │   ├── transaction.model.js# Transaction schema with DB indexes
│   │   └── category.model.js   # Category schema (global + user-specific)
│   ├── controllers/
│   │   ├── auth.controller.js       # Register, Login, Logout
│   │   ├── transaction.controller.js# CRUD for transactions
│   │   ├── category.controller.js   # List and create categories
│   │   └── report.controller.js     # Monthly and category-wise reports
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── transaction.routes.js
│   │   ├── category.routes.js
│   │   └── report.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification — protect middleware
│   │   └── validate.middleware.js# express-validator error handler
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── transaction.validator.js
│   │   ├── category.validator.js
│   │   └── report.validator.js
│   └── utils/
│       ├── ApiError.js       # Custom error class (extends Error)
│       ├── ApiResponse.js    # Standardized success/error response helpers
│       └── asyncHandler.js   # Async error wrapper (Decorator Pattern)
```

---

## Architecture

The project follows a layered MVC architecture:

```
Request → Routes → Validators → Middleware → Controllers → Models → MongoDB
                                                    ↓
                                              Utils (ApiResponse, ApiError)
```

- `server.js` bootstraps the app — loads env, connects DB, starts the HTTP listener
- `src/app.js` configures Express — registers routes, middleware, and the global error handler
- Routes define endpoints and attach validators + middleware
- Validators (express-validator) sanitize and validate input before it reaches controllers
- `protect` middleware authenticates every protected route via JWT
- Controllers handle business logic and interact directly with Mongoose models
- `asyncHandler` wraps every async controller to forward errors to the global error handler
- The global error handler in `app.js` normalizes all errors into a consistent JSON response

---

## OOP Concepts Applied

| Concept | Where |
|---|---|
| Encapsulation | Mongoose schemas encapsulate data structure and validation rules; `ApiError` encapsulates error state (message, statusCode, details) |
| Inheritance | `ApiError extends Error` — inherits native Error behavior and adds HTTP-specific properties |
| Abstraction | `asyncHandler`, `sendSuccess`, `sendError` abstract away repetitive patterns from controllers |
| Polymorphism | The global error handler handles `ValidationError`, `CastError`, and `ApiError` polymorphically based on `err.name` and `err.statusCode` |

---

## Design Patterns Applied

### 1. Singleton Pattern — `config/db.js`
The `connectDB` function maintains a single MongoDB connection instance. If called multiple times, it returns the existing connection instead of creating a new one.

```js
let instance = null;
const connectDB = async () => {
  if (instance) return instance;
  instance = await mongoose.connect(process.env.MONGO_URI);
  return instance;
};
```

### 2. Decorator Pattern — `utils/asyncHandler.js`
`asyncHandler` wraps any async route handler and adds error-catching behavior without modifying the original function — a textbook decorator.

```js
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    next(err);
  }
};
```

### 3. Chain of Responsibility — `app.js` (Error Handling Middleware)
Express middleware chains implement this pattern. Each middleware either handles the request or passes it to the next handler via `next()`. The global error handler at the end of the chain catches all unhandled errors.

---

## SOLID Principles

| Principle | Application |
|---|---|
| Single Responsibility (SRP) | Each file has one job — models define schema, controllers handle logic, validators handle input, middleware handles auth |
| Open/Closed (OCP) | New route modules can be added to `app.js` without modifying existing ones; validators are independently extensible |
| Liskov Substitution (LSP) | `ApiError` can replace any native `Error` object anywhere in the codebase without breaking behavior |
| Interface Segregation (ISP) | Validators are split per resource (`auth.validator`, `transaction.validator`, etc.) — controllers only use what they need |
| Dependency Inversion (DIP) | Controllers depend on Mongoose model abstractions, not raw DB drivers; `asyncHandler` depends on the function abstraction, not concrete implementations |

---

## Setup and Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the `backend/` directory:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

### 4. Seed predefined categories
```bash
npm run seed
```

This populates the database with 16 global categories (Salary, Food & Dining, Transportation, etc.).

### 5. Start the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:8000`

---

## API Overview

Base URL: `http://localhost:8000/api`

All protected routes require authentication via HttpOnly cookie (set automatically on login) or `Authorization: Bearer <token>` header.

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login, sets cookie | No |
| GET | `/auth/logout` | Clear auth cookie | No |

### Categories
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/categories` | Get global + user categories | Yes |
| POST | `/categories` | Create custom category | Yes |

### Transactions
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/transactions` | Create transaction | Yes |
| GET | `/transactions` | Get all (with filters) | Yes |
| PUT | `/transactions/:id` | Update transaction | Yes |
| DELETE | `/transactions/:id` | Delete transaction | Yes |

### Reports
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/reports/monthly` | Monthly income/expense summary | Yes |
| GET | `/reports/category` | Category-wise breakdown | Yes |

For full request/response examples, see [API_DOCS.md](./API_DOCS.md).

---

## Global Response Format

```json
// Success
{ "success": true, "message": "...", "data": {} }

// Error
{ "success": false, "error": { "message": "...", "details": [] } }
```

---

## Team Members

| Name | Contribution |
|---|---|
| [Member 1] | [e.g., Auth module, JWT middleware] |
| [Member 2] | [e.g., Transaction CRUD, Validators] |
| [Member 3] | [e.g., Reports, Aggregation pipeline] |
| [Member 4] | [e.g., Category module, Seeding] |
| [Member 5] | [e.g., Architecture, Error handling, Documentation] |
