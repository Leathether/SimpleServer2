import pool from '../config/db.js';
import jwt from 'jsonwebtoken';



export default async function verifyToken(token, password) {
    try {
        console.log('Verifying token with password:', password, 'and the token is', token);
        const decoded = jwt.verify(token, password);
        return decoded;
    } catch (error) {
        return null;
    }
}