import pool from '../../../config/db.js';
import verifyToken from '../../../methods/verifyToken.js';
import jwt from 'jsonwebtoken';
export default async function router(req, res) {
  let body = '';
  
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  
  req.on('end', async () => {
    try {
      try {
        body = body ? JSON.parse(body) : {};
      } catch (err) {
        console.error('Invalid JSON body received:', body);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid JSON in request body' }));
        return;
      }
      // Extract token from Authorization header
      const authHeader = req.headers['authorization'] || req.headers['Authorization'];
      if (!authHeader) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'No or invalid Authorization header' }));
        return;
      }
      console.log('body received in specUser route:', body);
      // Import JWT here to pass to verifyToken
      const JWT = (jwt.decode());
      const decoded = await verifyToken(body.token, body.password);
      console.log("the user was/was not authorized", decoded)
      if (!decoded || !decoded.username) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid or expired token' }));
        return; // Stop execution if token is invalid
      }
      
      // Corrected and intended line:
      const username = decoded.username;
      let connection = await pool.getConnection();
      // Get user info for permission check
      let query = 'SELECT powerLevel FROM users WHERE username = ?';
      const [users] = await connection.execute(query, [username]);
      if (!users || users.length === 0) {
        connection.release();
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
        return;
      }
      const perms = users[0].powerLevel;
      if (perms === 'admin' || perms === 'normal') {
        console.log('Authentication successful for user:', username);
        let usernameQuery = 'SELECT score FROM highscores WHERE userId = (SELECT id FROM users WHERE username = ?) ORDER BY score DESC LIMIT 1';
        const [userRequested] = await connection.execute(usernameQuery, [body.usernameRequested]);
        connection.release();
        if (userRequested.length === 0) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Requested user not found' }));
          return;
        } else {
          console.log('Requested user found:', userRequested);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ requestedUser: `Highscore:${userRequested[0].score}, Username:${body.usernameRequested}` }));
        }
      } else {
        connection.release();
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Insufficient permissions' }));
        return;
      }
      } catch (error) {
        console.error('Error in specUser route:', error);
        try {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Error processing request' }));
        } catch (err) {
          console.error('Failed to send error response:', err);
        }
        return;
      }
    });
}
  
      
  
