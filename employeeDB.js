import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand, UpdateCommand, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { table } from "./config/config.js";

const client = new DynamoDBClient({ region: "eu-north-1" });

const ddbClient = DynamoDBDocumentClient.from(client);

// GET all item
const getAllEmployees = async () => {
    const params = {
        TableName: table,
    };
    try {
        const data = await ddbClient.send(new ScanCommand(params));
        // console.log(data);
        return data.Items;
    } catch (error) {
        console.log(error);
        throw (error);
    }
}

// GET item
const getEmployee = async (id) => {
    const params = {
        TableName: table,
        Key: {
            'id': id
        }
    };
    try {
        const data = await ddbClient.send(new GetCommand(params));
        // console.log(data);
        if (!data.Item) return null;
        return {
            id: data.Item.id,
            name: data.Item.name,
            department: data.Item.department,
            salary: data.Item.salary
        };
    } catch (error) {
        console.log(error);
        throw (error);
    }
}

// CREATE item
const createEmployee = async (name, department, salary) => {
    const params = {
        TableName: table,
        Item: {
            'id': uuidv4(),
            name,
            department,
            salary
        }
    };
    try {
        const data = await ddbClient.send(new PutCommand(params));
        // console.log(data);
        return {
            id: params.Item.id,
            name: params.Item.name,
            department: params.Item.department,
            salary: params.Item.salary
        };
    } catch (error) {
        console.log(error);
        throw (error);
    }
}


// UPDATE item
const updateEmployee = async (id, name, department, salary) => {
    const params = {
        TableName: table,
        Key: {
            'id': id
        },
        UpdateExpression: "set #nm = :n, department= :d, salary= :s",
        ExpressionAttributeNames: {
            "#nm": "name"
        },
        ExpressionAttributeValues: {
            ":n": name,
            ":d": department,
            ":s": salary
        },
        ReturnValues: "UPDATED_NEW"
    };
    try {
        const data = await ddbClient.send(new UpdateCommand(params));
        // console.log(data);
        return {
            id,
            name: data.Attributes.name,
            department: data.Attributes.department,
            salary: data.Attributes.salary
        };
    } catch (error) {
        console.log(error);
        throw (error);
    };
};

// DELETE item
const deleteEmployee = async (id) => {
    const params = {
        TableName: table,
        Key: {
            'id': id
        }
    }
    try {
        const data = await ddbClient.send(new DeleteCommand(params));
        // console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        throw (error);
    }
}

// GET Highest salary with department
const getHighestSal = async (dept) => {
    const command = new QueryCommand({
        TableName: table,
        IndexName: "dept-salary-index",
        KeyConditionExpression: "department = :d",
        ExpressionAttributeValues: { ":d": dept },
        ScanIndexForward: false,
        Limit: 1
    });
    try {
        const data = await ddbClient.send(command);
        // console.log(data);
        return data.Items
    } catch (error) {
        console.log(error);
        throw (error);
    }
}

// Delete all employees
const deleteAllEmployee = async () => {
    try {
        const data = await getAllEmployees();
        if (!data.length) return;
        for (const e of data) {
            await deleteEmployee(e.id);
        };
    } catch (error) {
        console.error(error);
    }
}

export { getAllEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, getHighestSal, deleteAllEmployee }