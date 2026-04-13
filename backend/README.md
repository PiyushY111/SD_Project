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
│   │   ├── user.model.js           # User schema with password hashing hooks
│   │   ├── transaction.model.js    # Transaction schema with DB indexes
│   │   └── category.model.js       # Category schema (global + user-specific)
│   ├── controllers/
│   │   ├── auth.controller.js       # Register, Login, Logout
│   │   ├── transaction.controller.js# CRUD + Observer event emission
│   │   ├── category.controller.js   # List and create categories
│   │   └── report.controller.js     # Strategy-injected report generation
│   ├── patterns/
│   │   ├── strategies/
│   │   │   ├── BaseReportStrategy.js      # Abstract base (Strategy Pattern)
│   │   │   ├── MonthlyReportStrategy.js   # Concrete strategy — monthly report
│   │   │   └── CategoryReportStrategy.js  # Concrete strategy — category report
│   │   └── observers/
│   │       ├── TransactionEventEmitter.js # Singleton EventEmitter (Observer subject)
│   │       └── TransactionLogger.js       # Concrete observer — logs events
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── transaction.routes.js
│   │   ├── category.routes.js
│   │   └── report.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT verification — protect middleware
│   │   └── validate.middleware.js # express-validator error handler
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

The project follows a layered MVC architecture with a dedicated patterns layer:

```
Request → Routes → Validators → Middleware → Controllers → Models → MongoDB
                                                  ↓              ↑
                                           patterns/          (Mongoose)
                                        strategies/ observers/
                                                  ↓
                                            Utils (ApiResponse, ApiError)
```

- `server.js` bootstraps the app — loads env, connects DB, starts the HTTP listener
- `app.js` configures Express — registers routes, middleware, global error handler, and bootstraps observers
- Routes define endpoints and attach validators + middleware
- Validators (express-validator) sanitize and validate input before it reaches controllers
- `protect` middleware authenticates every protected route via JWT
- Controllers handle business logic; report controllers delegate to injected strategy objects
- `patterns/strategies/` — Strategy Pattern for swappable report generation algorithms
- `patterns/observers/` — Observer Pattern for decoupled transaction lifecycle events
- `asyncHandler` wraps every async controller to forward errors to the global error handler
- The global error handler in `app.js` normalizes all errors into a consistent JSON response

---

## OOP Concepts Applied

| Concept | Where |
|---|---|
| Encapsulation | Mongoose schemas encapsulate data structure and validation; `ApiError` encapsulates error state (message, statusCode, details); `TransactionEventEmitter` encapsulates the event bus |
| Inheritance | `ApiError extends Error`; `MonthlyReportStrategy extends BaseReportStrategy`; `CategoryReportStrategy extends BaseReportStrategy` |
| Abstraction | `BaseReportStrategy` defines the abstract `generate()` interface; `asyncHandler`, `sendSuccess`, `sendError` abstract repetitive patterns |
| Polymorphism | `generate()` and `getType()` are overridden in each strategy subclass — same interface, different behavior; global error handler handles multiple error types polymorphically |

---

## Design Patterns Applied

### 1. Singleton Pattern — `config/db.js` and `patterns/observers/TransactionEventEmitter.js`
The `connectDB` function maintains a single MongoDB connection instance. `TransactionEventEmitter` also uses a static `getInstance()` method to ensure a single shared event bus across the app.

```js
// db.js
let instance = null;
const connectDB = async () => {
  if (instance) return instance;
  instance = await mongoose.connect(process.env.MONGO_URI);
  return instance;
};

// TransactionEventEmitter.js
static getInstance() {
  if (!TransactionEventEmitter.#instance)
    TransactionEventEmitter.#instance = new TransactionEventEmitter();
  return TransactionEventEmitter.#instance;
}
```

### 2. Strategy Pattern — `patterns/strategies/`
Report generation algorithms are encapsulated in interchangeable strategy classes. `ReportController` receives a strategy via dependency injection and calls `strategy.generate(params)` — the algorithm can be swapped without changing the controller.

```
BaseReportStrategy (abstract)
  ├── MonthlyReportStrategy   → generate({ userId, month, year })
  └── CategoryReportStrategy  → generate({ userId, startDate, endDate })
```

### 3. Observer Pattern — `patterns/observers/`
`TransactionEventEmitter` (subject) emits lifecycle events (`transaction:created`, `transaction:updated`, `transaction:deleted`). `TransactionLogger` (observer) subscribes and reacts — completely decoupled from the controller.

```js
// Controller emits (subject)
emitter.emitCreated(transaction);

// Logger listens (observer)
emitter.on('transaction:created', (t) => console.log(...));
```

### 4. Decorator Pattern — `utils/asyncHandler.js`
Wraps any async route handler and adds error-catching behavior without modifying the original function.

```js
const asyncHandler = (fn) => async (req, res, next) => {
  try { await fn(req, res, next); }
  catch (err) { next(err); }
};
```

### 5. Chain of Responsibility — Express Middleware Pipeline
Each middleware either handles the request or passes it via `next()`. The global error handler at the end catches all unhandled errors.

---

## SOLID Principles

| Principle | Application |
|---|---|
| **S** — Single Responsibility | Each file has one job: models define schema, controllers handle HTTP logic, validators handle input, strategies handle report algorithms, observers handle side effects |
| **O** — Open/Closed | `ReportController` is closed for modification — add a new report type by creating a new strategy class and injecting it. New observers can be added to `app.js` without touching controllers |
| **L** — Liskov Substitution | `MonthlyReportStrategy` and `CategoryReportStrategy` are fully substitutable for `BaseReportStrategy` — any code accepting a `BaseReportStrategy` works with either. `ApiError` is fully substitutable for `Error` |
| **I** — Interface Segregation | Validators are split per resource (`auth.validator`, `transaction.validator`, etc.) — controllers only import what they need. `BaseReportStrategy` exposes only `generate()` and `getType()`, not unrelated methods |
| **D** — Dependency Inversion | `ReportController` depends on the `BaseReportStrategy` abstraction, not concrete classes. Strategies are injected at the route level, making them swappable (e.g., for testing) |

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
