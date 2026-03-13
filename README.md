# Employee API - POC

A **Proof of Concept (POC)** REST API built using **Node.js, Express, and AWS DynamoDB** to demonstrate a complete CRUD workflow for employee management with role-based access control.

## Features

* Create, Read, Update, Delete employees
* Retrieve employee with highest salary in a department
* Role-based access control (Admin only)
* Input validation for employee fields
* Comprehensive unit and integration tests

## Tech Stack

* Node.js & Express.js
* AWS DynamoDB (AWS SDK v3)
* UUID for unique IDs
* Jest & Supertest for testing

## Project Structure

```
.
├── app.js                 # Express server and route definitions
├── employeeDB.js          # DynamoDB operations (CRUD)
├── config/config.js       # Environment variables and table config
├── utils/encrypt.js       # Encryption utilities for role-based access
├── tests/
│   ├── integration/       # Integration tests for API endpoints
│   └── unit/              # Unit tests for utility functions
└── README.md
```

## Configuration

Environment variables are managed through `.env` files.

### Development `.env`

```
PORT=3000
NODE_ENV=development
SECRET_KEY=your_secret_key
AWS_REGION=eu-north-1
TABLE_NAME=employee
```

### Testing `.env.test`

```
PORT=3001
NODE_ENV=test
SECRET_KEY=test_secret
AWS_REGION=eu-north-1
TABLE_NAME=employee_test
```

* `NODE_ENV=test` ensures that tests run against a separate DynamoDB table to prevent affecting production data.
* `SECRET_KEY` is used for encrypting and decrypting roles in requests.

## Running the Project

Install dependencies:

```
npm install
```

Start the server:

```
node app.js
```

Server will run at:

```
http://localhost:3000
```

## Testing

Run all tests (unit + integration):

```
npm test
```

* **Unit Tests:** Validate utility functions such as encryption and input validation.
* **Integration Tests:** Verify API endpoints including CRUD operations, auth middleware, and error handling.
* Test database isolation is achieved using `.env.test` with a separate DynamoDB table.
* Recommended to use `beforeAll` and `afterAll` hooks to reset test data before and after tests.

## DynamoDB Table

**Table Name:** `employee` (or `employee_test` for tests)

**Primary Key:**

```
id (String)
```

**Example Item:**

```json
{
  "id": "uuid",
  "name": "John Doe",
  "department": "Engineering",
  "salary": 5000
}
```

## Notes

* This project serves as a POC demonstrating integration between **Express APIs** and **AWS DynamoDB**.
* Role-based authentication ensures only authorized users (Admin) can perform certain operations.
* Tests are structured for clarity and isolation, ensuring reliable test outcomes without affecting live data.
