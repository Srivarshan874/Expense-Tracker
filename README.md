# Expense Tracker API

A REST API built with Node.js, Express, and MongoDB for managing expenses, filtering by category/date, generating spending summaries, and checking monthly budgets.

## Features

- Create, view, update, and delete expenses
- Validate expense amount, category, and date
- Filter by category and date range
- Monthly totals and category summaries using MongoDB aggregation
- Monthly budget setup and overspending status
- Centralized error handling and health-check endpoint

## Requirements

- Node.js 18+
- MongoDB local instance or MongoDB Atlas connection string

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Srivarshan874/Expense-Tracker.git
   cd Expense-Tracker
   ```
2. Install packages: `npm install`
3. Copy `.env.example` to `.env` and set `MONGODB_URI`.
4. Start development server: `npm run dev`

Server defaults to `http://localhost:5000`.

## API endpoints

Base API path: `/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/expenses` | Create expense |
| GET | `/api/expenses` | List expenses; optional `category`, `startDate`, `endDate` filters |
| GET | `/api/expenses/:id` | Get one expense |
| PATCH | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/reports/monthly?year=2026&month=10` | Monthly total and count |
| GET | `/api/reports/categories?startDate=2026-01-01&endDate=2026-12-31` | Category-wise totals |
| PUT | `/api/budgets/:year/:month` | Create or update a monthly budget |
| GET | `/api/budgets/:year/:month/status` | Compare spending with budget |

### Create expense example

```json
{
  "amount": 250,
  "category": "Food",
  "date": "2026-10-24",
  "description": "Lunch"
}
```

### Filter expenses

`GET /api/expenses?category=Food&startDate=2026-10-01&endDate=2026-10-31`

### Set a monthly budget

Send `PUT /api/budgets/2026/10` with JSON body:

```json
{ "amount": 10000 }
```

## Security and notes

- `.env` is ignored by Git. Do not commit database credentials or secrets.
- Expense and budget amounts must be positive numbers.
- This repository contains the backend API; a frontend is not included.
