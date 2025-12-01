import hash from './hash.js';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import auth from './auth.js';
import verifyToken from './verifyToken.js';

export default async function createUser(username, password, perms, highscore) {
    let connection;
    try {
        console.log('Creating user:', username);
        connection = await pool.getConnection();


        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE username = ?;',
            [username]
        );
        console.log('User existence check result:', rows);
        let salt = bcrypt.genSaltSync(10);

        if (rows.length === 0) {
            const [result] = await connection.execute(
                'INSERT INTO users (username, userPassword, powerLevel, salt) VALUES (?, ?, ?, ?);',
                [username, hash(password, salt), perms, salt]
            );

            if (typeof highscore !== 'undefined') {
                await connection.execute(
                    'INSERT INTO highscores (userId, score) VALUES ((SELECT id FROM users WHERE username = ?), ?);',
                    [username, highscore]
                );
            }
            const token = await auth(username, password, true);
            console.log('User created:', username);
            return token;
        } else {
            const decoded = verifyToken(rows[0].token, true);
            const passwordMatch = await auth(username, password, true);
            if ((decoded && decoded.username === username) || (await passwordMatch !== false)) {
                await connection.execute(
                'INSERT INTO highscores (userId, score) VALUES ((SELECT id FROM users WHERE username = ?), ?);',
                [username, highscore]
            );  

                console.log('Highscore added for existing user:', username);
                return true;
            } else {
                return false;
            }
            
        }
    } finally {
        if (connection) connection.release();
    }
}



