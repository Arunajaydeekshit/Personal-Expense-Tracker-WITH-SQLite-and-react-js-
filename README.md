### Objective:

Develop a RESTful API for managing personal financial records. Users can record their income and expenses, retrieve past transactions, and get summaries by category or time period.

### Tools and Technologies:

- **Backend Framework**: Node.js with Express.js
- **Database**: SQLite (for simplicity) or MongoDB (if you prefer a NoSQL solution)

### Requirements:

1. **Database Setup**
    - If using **SQLite**, create a database with tables:
        - `transactions`: id, type (income or expense), category, amount, date, description
        - `categories`: id, name, type (income or expense)
    - If using **MongoDB**, define collections:
        - `transactions`: { type, category, amount, dat
