import pool from '../config/db.js';

export default async function getPerms(username) {
    const connection = await pool.getConnection();
    
    const [perms] = await connection.query(
        'SELECT powerLevel FROM users WHERE username = ?',
        [username]
    );

    connection.release();

    return perms;
}