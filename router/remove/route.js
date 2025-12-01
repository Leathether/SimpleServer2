import pool from '../../config/db.js';
import verifyToken from '../../methods/verifyToken.js';

export default async function deleteRouter(req, res) {
    try {
        // read request body
        let body = await new Promise((resolve, reject) => {
            let data = '';
            req.on('data', chunk => (data += chunk));
            req.on('end', () => resolve(data));
            req.on('error', err => reject(err));
        });
        body = await JSON.parse(body);
        const connection = await pool.getConnection();
        let [perms] = await connection.execute(
            'SELECT powerLevel FROM users WHERE username = ?;',
            [body.usernameIs]
        );
        if (verifyToken(body.token, body.password) == false && perms[0].powerLevel !== 'admin') {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Authentication failed' }));
            return;
        } else if (perms[0].powerLevel === 'admin') {
            await connection.execute(
                'DELETE FROM highscores WHERE userId = (SELECT id FROM users WHERE username = ?);',
                [body.usernameDelete]
            );
            await connection.execute(
                'DELETE FROM users WHERE username = ?;',
                [body.usernameDelete]
            );
            connection.release();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User deleted successfully' }));
        }

    } catch (error) {
        console.error('Error in delete route:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error processing delete request' }));
    }}