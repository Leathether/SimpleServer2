import pool from '../../config/db.js';
import createUser from '../../methods/createUser.js';


export default async function router(req, res) {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        let user;
        try {
          user = body ? JSON.parse(body) : {};
        } catch (err) {
          console.error('Invalid JSON body received:', body);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid JSON in request body' }));
          return;
        }

        if (!user.username || !user.userPassword) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'username and userPassword are required' }));
          return;
        }

        const created = await createUser(user.username, user.userPassword, 'normal', user.score || 0);

        if (created) {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'User created or updated sucessfully' }));
        } else {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'there was an error' }));
        }
      } catch (error) {
        console.error('Error in create route:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error creating user' }));
        return;
      }
    });
}