import express from "express";
import { createEmployee, deleteEmployee, getAllEmployees, getEmployee, updateEmployee } from './employeeDB.js';

const app = express();

// json middleware
app.use(express.json());

// validation function
const validateEmployee = (name, department) => {
    if (!name || !department) return "All Fields required!";
    if (name.trim().length <= 3) return "Name should be more than 3 characters!";
    if (department.trim().length <= 1) return "Department should be more than 1 character!";
    return null
}

// GET All employees
app.get('/api/employees', async (req, res, next) => {
    // res with all employees data
    try {
        const data = await getAllEmployees()
        return res.status(200).json({   // 200 - OK
            message: "Employees retrieved successfully", data
        });
    } catch (error) {
        next(error)
    }
});


// GET an employee
app.get('/api/employees/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        // finding employee, if not found return 404
        const employee = await getEmployee(id);
        if (!employee) return res.status(404).json({ message: "Employee not found!" }); // 404 - Not Found
        // res with employee and status 200
        return res.status(200).json({
            message: "Employee retrieved successfully",
            data: employee
        });
    } catch (error) {
        next(error)
    };
});

// POST Creating employee
app.post('/api/employees', async (req, res, next) => {
    if (!req.body) return res.status(400).json({ message: "Request body is required!" });
    // assigning and validating req values
    const { name, department } = req.body;
    const error = validateEmployee(name, department);
    if (error) return res.status(400).json({ message: error });
    try {
        // creating employee
        const employee = await createEmployee(name, department)
        // res with created employee and status 201
        return res.status(201).json({   // 201 - Created 
            message: `Employee created successfully with ID ${employee.id}`,
            data: employee
        });
    } catch (error) {
        next(error)
    }
});

// PUT Updating employee
app.put('/api/employees/:id', async (req, res, next) => {
    const id = req.params.id;
    if (!req.body) return res.status(400).json({ message: "Request body is required!" });
    // assigning and validating req values
    const { name, department } = req.body;
    const error = validateEmployee(name, department);
    if (error) return res.status(400).json({ message: error });
    try {
        // finding employee, if not found return 404
        const employee = await getEmployee(id);
        if (!employee) return res.status(404).json({ message: "Employee not found!" });
        // updating employee data
        const data = await updateEmployee(id, name, department);
        // res with updated employee and status 200
        return res.status(200).json({
            message: "Employee updated successfully",
            data
        });
    } catch (error) {
        next(error)
    }
});

// DELETE Employee
app.delete('/api/employees/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        // finding employee, if not found return 404
        const employee = await getEmployee(id);
        if (!employee) return res.status(404).json({ message: "Employee not found!" });
        // deleting employee
        await deleteEmployee(id);
        // res with deleted employee and status 200
        return res.status(200).json({
            message: `Employee deleted successfully with ID ${id}`,
            data: employee
        });
    } catch (error) {
        next(error)
    };
});

// Handle unknown routes
app.use((req, res) => {
    return res.status(404).json({
        message: "Route not found"
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({       // 500 - Internal Server Error
        message: "Internal Server Error"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started listening on port ${PORT}`));