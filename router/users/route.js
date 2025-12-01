import pool from '../../config/db.js';

export default async function router(req, res) {
    try {
      const connection = await pool.getConnection();
      const [users] = await connection.query('SELECT id, username, powerLevel FROM users LIMIT 2');
      connection.release();
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
    } catch (error) {
      console.error('Database error:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error fetching users from database');
    }
}