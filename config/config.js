import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV || "development";

const envFile = env === "test" ? ".env.test" : ".env";

dotenv.config({
    path: path.resolve(process.cwd(), envFile)
});

export const table = process.env.TABLE;
export const secretKey = process.env.SECRET_KEY;