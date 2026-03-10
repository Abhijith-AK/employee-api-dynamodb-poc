# Employee API - POC

This project is a **Proof of Concept (POC)** REST API built using **Node.js, Express, and AWS DynamoDB**.  
It demonstrates basic CRUD operations on employee data using **AWS SDK v3 Document Client**.

## Features

- Create Employee
- Get All Employees
- Get Employee by ID
- Update Employee
- Delete Employee

## Tech Stack

- Node.js
- Express.js
- AWS DynamoDB
- AWS SDK v3
- UUID

## Project Structure

```
.
├── app.js
├── employeeDB.js
└── README.md
```

## DynamoDB Table

Table Name: `employee`

Primary Key:

```
id (String)
```

Example Item:

```json
{
  "id": "uuid",
  "name": "John",
  "department": "Engineering"
}
```

## Run the Project

Install dependencies

```
npm install
```

Start the server

```
node app.js
```

Server runs at:

```
http://localhost:3000
```

## Notes

This project was developed as a **POC to demonstrate integration between Express APIs and AWS DynamoDB**.