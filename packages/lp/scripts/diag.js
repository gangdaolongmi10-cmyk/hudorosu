const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.join(__dirname, '../../../.env');
console.log('Trying to load .env from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.log('Error loading .env:', result.error);
}

console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function run() {
    try {
        const clients = await pool.connect();
        console.log('Successfully connected to DB');

        const { rows: users } = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@example.com']);
        console.log('User found:', users.length > 0);
        if (users.length > 0) {
            console.log('User ID:', users[0].id);

            const { rows: auths } = await pool.query('SELECT * FROM local_auth WHERE user_id = $1', [users[0].id]);
            console.log('Auth info found:', auths.length > 0);
            if (auths.length > 0) {
                const isValid = await bcrypt.compare('admin123', auths[0].password_hash);
                console.log('Password "admin123" is valid:', isValid);
            }
        }

        clients.release();
    } catch (err) {
        console.error('DB Error:', err);
    } finally {
        await pool.end();
    }
}

run();
