import { createEmployee, deleteAllEmployee, deleteEmployee, getAllEmployees, getEmployee, getHighestSal, updateEmployee } from "../../employeeDB";

describe("Employee DB Functions", () => {

    beforeAll(async () => {
        await deleteAllEmployee(); // Clean DB before tests
    });

    afterAll(async () => {
        await deleteAllEmployee(); // Clean DB after tests
    }, 15000);

    it("should create an employee", async () => {
        const emp = await createEmployee("John Doe", "IT", 5000);
        expect(emp).toHaveProperty("id");
        expect(emp.name).toBe("John Doe");
        expect(emp.department).toBe("IT");
        expect(emp.salary).toBe(5000);
    });

    it("should get an employee by id", async () => {
        const emp = await createEmployee("Jane Smith", "HR", 6000);
        const fetched = await getEmployee(emp.id);

        expect(fetched.id).toBe(emp.id);
        expect(fetched.name).toBe("Jane Smith");
        expect(fetched.department).toBe("HR");
        expect(fetched.salary).toBe(6000);
    });

    it("should return null for non-existing employee", async () => {
        const fetched = await getEmployee("non-existent-id");
        expect(fetched).toBeNull();
    });

    it("should get all employees", async () => {
        await deleteAllEmployee();
        await createEmployee("A", "IT", 1000);
        await createEmployee("B", "IT", 2000);

        const all = await getAllEmployees();
        expect(all.length).toBe(2);
        expect(all.map(e => e.name)).toContain("A");
        expect(all.map(e => e.name)).toContain("B");
    });

    it("should update an employee", async () => {
        const emp = await createEmployee("Old Name", "IT", 3000);
        const updated = await updateEmployee(emp.id, "New Name", "HR", 4000);

        expect(updated.id).toBe(emp.id);
        expect(updated.name).toBe("New Name");
        expect(updated.department).toBe("HR");
        expect(updated.salary).toBe(4000);
    });

    it("should delete an employee", async () => {
        const emp = await createEmployee("To Delete", "IT", 2000);
        await deleteEmployee(emp.id);
        const fetched = await getEmployee(emp.id);
        expect(fetched).toBeNull();
    });

    it("should return highest salary employee for department", async () => {
        await deleteAllEmployee();
        await createEmployee("Low", "IT", 1000);
        await createEmployee("High", "IT", 5000);
        await createEmployee("OtherDept", "HR", 7000);

        const highest = await getHighestSal("IT");
        expect(highest.length).toBe(1);
        expect(highest[0].name).toBe("High");
        expect(highest[0].salary).toBe(5000);
    });

    it("deleteAllEmployee should remove all employees", async () => {
        await createEmployee("Temp1", "IT", 1000);
        await createEmployee("Temp2", "HR", 2000);
        await deleteAllEmployee();

        const all = await getAllEmployees();
        expect(all).toEqual([]);
    }, 10000);

});