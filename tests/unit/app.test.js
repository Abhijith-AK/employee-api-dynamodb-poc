import { decrypt, validateEmployee } from "../../app.js";
import {encrypt} from "../../utils/encrypt.js"

describe("Input Validation", () => {
    it("should return error if fields missing", () => {
        expect(validateEmployee()).toBe("All Fields required!");
    });

    it("should return error if name too short", () => {
        expect(validateEmployee("abc", "IT", 50000))
            .toBe("Name should be more than 3 characters!");
    });

    it("should return error if department too short", () => {
        expect(validateEmployee("John", "I", 50000))
            .toBe("Department should be more than 1 character!");
    });

    it("should return error if salary invalid", () => {
        expect(validateEmployee("John", "IT", -100))
            .toBe("Salary must be a valid positive number");
    });

    it("should return null for valid input", () => {
        expect(validateEmployee("John Doe", "IT", 50000))
            .toBeNull();
    });
});

describe("Decryption", () => {
    it("should return null if encrypted text is invalid format", () => {
        expect(decrypt("encryptedText")).toBeNull();
    });

    it("should return null if encrypted text is empty", () => {
        expect(decrypt("")).toBeNull();
    });

    it("should return null if IV is invalid", () => {
        expect(decrypt("invalidiv:abcdef")).toBeNull();
    });

    it("should return null if encrypted value corrupted", () => {
        expect(decrypt("1234567890abcdef:invalidcipher")).toBeNull();
    });

    it("should correctly decrypt valid encrypted text", () => {
        const encrypted = encrypt("admin");
        const result = decrypt(encrypted);

        expect(result).toBe("admin");
    });
})
