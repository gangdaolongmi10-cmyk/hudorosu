import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "packages/lp/.env") });

import pool from "./packages/lp/lib/db";
import bcrypt from "bcryptjs";

async function testAuth() {
    const email = "admin@example.com";
    const password = "admin123";

    console.log("Testing auth for:", email);

    try {
        const { rows: users } = await pool.query(
            'SELECT id, email, name FROM users WHERE email = $1',
            [email]
        );

        if (users.length === 0) {
            console.log("User not found");
            return;
        }

        const user = users[0];
        console.log("User found:", user);

        const { rows: auths } = await pool.query(
            'SELECT password_hash FROM local_auth WHERE user_id = $1',
            [user.id]
        );

        if (auths.length === 0) {
            console.log("No local_auth found");
            return;
        }

        const isValid = await bcrypt.compare(password, auths[0].password_hash);
        console.log("Password valid:", isValid);
        console.log("Hash in DB:", auths[0].password_hash);

        // Debug: what is the hash of admin123?
        const debugHash = await bcrypt.hash(password, 10);
        console.log("New hash for admin123:", debugHash);
        const debugCompare = await bcrypt.compare(password, debugHash);
        console.log("Debug compare (should be true):", debugCompare);

    } catch (err) {
        console.error("Error during test:", err);
    } finally {
        await pool.end();
    }
}

testAuth();
