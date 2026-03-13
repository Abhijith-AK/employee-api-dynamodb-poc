import request from "supertest";
import { app } from "../../app";
import { encrypt } from "../../utils/encrypt";
import { createEmployee, deleteAllEmployee, deleteEmployee } from "../../employeeDB";

const role = encrypt("admin");

describe("Auth Middleware", () => {

    it("should return 401 if role header missing", async () => {
        const res = await request(app).get("/api/employees");

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Role Missing");
    });

    it("should return 400 if encrypted role invalid", async () => {
        const res = await request(app)
            .get("/api/employees")
            .set("role", "invalidEncryptedValue");

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid encrypted role");
    });

    it("should return 403 if role other than admin", async () => {
        const role = encrypt("test");
        const res = await request(app)
            .get("/api/employees")
            .set("role", role);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Acces denied! Admin only.");
    });

});

describe("GET /employees", () => {
    beforeAll(async () => {
        await deleteAllEmployee();
    });

    it("should return 404 if No employees found", async () => {
        const res = await request(app)
            .get("/api/employees")
            .set("role", role);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("No employees found");
    })

    it("should return 200 and employees list", async () => {
        await createEmployee("test1", "test1", 1000);
        await createEmployee("test2", "test2", 2000);
        const res = await request(app)
            .get("/api/employees")
            .set("role", role);

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);
    })
})

describe("GET /employees/:id", () => {
    beforeAll(async () => await deleteAllEmployee());

    it("should return 404 if No employee found", async () => {
        const res = await request(app)
            .get("/api/employees/invalid")
            .set("role", role);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Employee not found!");
    })

    it("should return 200 if employee with valid id", async () => {
        const { id } = await createEmployee("test1", "test1", 1000);

        const res = await request(app)
            .get("/api/employees/" + id)
            .set("role", role);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Employee retrieved successfully");
        expect(res.body.data.name).toBe("test1");
    })
});

describe("POST /api/employees", () => {

    beforeAll(async () => {
        await deleteAllEmployee();
    });

    it("should return 400 if request body is missing", async () => {
        const res = await request(app)
            .post("/api/employees")
            .set("role", role);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Request body is required!");
    });

    it("should return 400 if name is invalid", async () => {
        const res = await request(app)
            .post("/api/employees")
            .set("role", role)
            .send({
                name: "ab",
                department: "IT",
                salary: 1000
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Name should be more than 3 characters!");
    });

    it("should return 400 if department is invalid", async () => {
        const res = await request(app)
            .post("/api/employees")
            .set("role", role)
            .send({
                name: "John",
                department: "I",
                salary: 1000
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Department should be more than 1 character!");
    });

    it("should return 400 if salary is invalid", async () => {
        const res = await request(app)
            .post("/api/employees")
            .set("role", role)
            .send({
                name: "John",
                department: "IT",
                salary: -100
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Salary must be a valid positive number");
    });

    it("should create employee and return 201", async () => {
        const res = await request(app)
            .post("/api/employees")
            .set("role", role)
            .send({
                name: "John",
                department: "IT",
                salary: 5000
            });

        expect(res.status).toBe(201);
        expect(res.body.message).toContain("Employee created successfully");
        expect(res.body.data.name).toBe("John");
        expect(res.body.data.department).toBe("IT");
        expect(res.body.data.salary).toBe(5000);
    });

});

describe("PUT /api/employees/:id", () => {

    beforeAll(async () => {
        await deleteAllEmployee();
    });

    it("should return 400 if request body is missing", async () => {
        const res = await request(app)
            .put("/api/employees/123")
            .set("role", role);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Request body is required!");
    });

    it("should return 400 if validation fails", async () => {
        const res = await request(app)
            .put("/api/employees/123")
            .set("role", role)
            .send({
                name: "ab",     // invalid (< 3 chars)
                department: "IT",
                salary: 1000
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Name should be more than 3 characters!");
    });

    it("should return 404 if employee does not exist", async () => {
        const res = await request(app)
            .put("/api/employees/unknown-id")
            .set("role", role)
            .send({
                name: "John Doe",
                department: "IT",
                salary: 5000
            });

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Employee not found!");
    });

    it("should return 200 when employee is updated successfully", async () => {
        const { id } = await createEmployee("John", "IT", 4000);

        const res = await request(app)
            .put(`/api/employees/${id}`)
            .set("role", role)
            .send({
                name: "John Updated",
                department: "Engineering",
                salary: 6000
            });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Employee updated successfully");
        expect(res.body.data.name).toBe("John Updated");
        expect(res.body.data.department).toBe("Engineering");
        expect(res.body.data.salary).toBe(6000);
    });

});

describe("DELETE /api/employees/:id", () => {
    let id;

    beforeAll(async () => {
        await deleteAllEmployee();
    });

    it("should return 404 if employee does not exist", async () => {
        const res = await request(app)
            .delete("/api/employees/non-existing-id")
            .set("role", role);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Employee not found!");
    });

    it("should delete employee and return 200", async () => {
        id = (await createEmployee("John", "IT", 5000)).id;
        const res = await request(app)
            .delete(`/api/employees/${id}`)
            .set("role", role);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe(`Employee deleted successfully with ID ${id}`);
        expect(res.body.data.name).toBe("John");
    });

    it("should ensure employee is actually deleted", async () => {
        const res = await request(app)
            .get(`/api/employees/${id}`)
            .set("role", role);

        expect(res.status).toBe(404);
    });

});

describe("GET /api/employees/highest-sal", () => {

    beforeAll(async () => {
        await deleteAllEmployee();
    });

    afterAll(async () => {
        await deleteAllEmployee();
    });

    

    it("should return 400 if department query is missing", async () => {
        const res = await request(app)
            .get("/api/employees/highest-sal")
            .set("role", role);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Department required");
    });

    it("should return 404 if no employees found for department", async () => {
        const res = await request(app)
            .get("/api/employees/highest-sal?dept=IT")
            .set("role", role);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("No employees found");
    });

    it("should return employee with highest salary in department", async () => {
        await createEmployee("John", "IT", 4000);
        await createEmployee("Jane", "IT", 7000);
        const res = await request(app)
            .get("/api/employees/highest-sal?dept=IT")
            .set("role", role);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Employee with highest salary from IT department");
        expect(res.body.data.name).toBe("Jane");
        expect(res.body.data.salary).toBe(7000);
    });

    it("should only consider employees from requested department", async () => {
        await createEmployee("Mary", "HR", 9000);
        const res = await request(app)
            .get("/api/employees/highest-sal?dept=IT")
            .set("role", role);

        expect(res.status).toBe(200);
        expect(res.body.data.department).toBe("IT");
    });

});

describe("Unknown Routes", () => {

    it("should return 404 for unknown route", async () => {
        const res = await request(app)
            .get("/api/unknown-route");

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Route not found");
    });

});