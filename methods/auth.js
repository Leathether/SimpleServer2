import pool  from "../config/db.js";
import hashPassword from "./hash.js";
import jwt from 'jsonwebtoken';
import hash from './hash.js';

export default async function authPassword (inputedUsername, inputedPassword) {
    try {
        const connection = await pool.getConnection();

        let [db] = await connection.query(
            'SELECT userPassword, salt FROM users WHERE userName = ?',
            [inputedUsername]
        );
        connection.release();
        let hashPassword = hash(inputedPassword, db[0].salt);
        let dbPassword = db[0].userPassword.toString();
        console.log('Authenticating user:', inputedUsername);
        console.log('Input password hash:', hashPassword, 'DB password hash:', dbPassword);
        if (dbPassword === hashPassword) {
            let token = {token:jwt.sign({ username: inputedUsername }, hashPassword, { expiresIn: '1h' }), password: dbPassword};
            return token;
        } else {
            return false;
        }
        
    } catch (error) {
        console.error('Error during authentication:', error);
      return false;
    }
}