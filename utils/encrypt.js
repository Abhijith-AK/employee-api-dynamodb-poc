import crypto from "crypto";
import {secretKey} from "../config/config"

const algorithm = "aes-256-cbc";
const iv = crypto.randomBytes(16); //Initialization Vector

export const encrypt = (text) => {
    const cipher = crypto.createCipheriv(
        algorithm,
        crypto.createHash('sha256').update(secretKey).digest(),
        iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}

const role = encrypt("admin");
// console.log(role);