


import http from 'http';
import { promises as fs } from 'fs';
import router from './router/route.js';
import usersRouter from './router/users/route.js';
import createRouter from './router/create/route.js';
import deleteRouter from './router/remove/route.js';

const hostname = 'localhost';
const PORT = process.env.PORT || 3000;
let filePath = './users.json';

const server = http.createServer(async (req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    router(req, res); 
  } else if (req.url === '/users' && req.method === 'GET') {
    usersRouter(req, res);
  } else if (req.url === '/create' && req.method === 'POST') { 
    createRouter(req, res);
  } else if (req.url === '/delete' && req.method === 'DELETE') {
    deleteRouter(req, res);
  } else {
    const content = await fs.readFile(filePath, 'utf-8');
    let placeholder = 0;
    for(const user of JSON.parse(content)) {
        if (user.highscore > placeholder) {
            placeholder = user.highscore;
        }
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('highscore: ' + placeholder);
  }
});

server.listen(PORT, hostname, () => {
  console.log(`Server is running on http://${hostname}:${PORT}`);
});