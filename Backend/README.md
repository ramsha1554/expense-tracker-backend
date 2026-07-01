# Expense Tracker API

A secure REST API for tracking personal expenses with JWT authentication and role-based access control (user/admin).

## Tech Stack
- Node.js + Express.js
- MongoDB (Mongoose)
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

Server runs on `http://localhost:5000`

## API Endpoints

### Auth — `/api/v1/auth`
| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | /register | Register a new user |
| POST | /login | Login and get JWT token |

### Expenses — `/api/v1/expenses` (JWT required)
| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | / | Create an expense |
| GET | / | Get logged-in user's expenses (supports `?category=&startDate=&endDate=`) |
| GET | /monthly-total | Get current month's total expenses |
| GET | /:id | Get single expense by ID |
| PUT | /:id | Update an expense |
| DELETE | /:id | Delete an expense |
| GET | /admin/all | Get all users' expenses (admin only) |

## Authentication
All expense routes require a JWT token in the header:


## Roles
- `user` — default role, can manage only their own expenses
- `admin` — can view all users' expenses via `/admin/all`

## Scalability Notes
See `SCALABILITY.md` for future scaling considerations.