


import http from 'http';
import { promises as fs } from 'fs';
import router from './router/route.js';
import usersRouter from './router/users/route.js';
import createRouter from './router/create/route.js';
import deleteRouter from './router/remove/route.js';
import specUserRouter from './router/users/specUser/route.js';
import authPassword from './methods/auth.js';
import loginRouter from './router/login/route.js';

const hostname = 'localhost';
const PORT = process.env.PORT || 3000;
let filePath = './users.json';

const server = http.createServer(async (req, res) => {
  //make sure the req is in json format
  if (!req.headers['content-type'] || req.headers['content-type'] !== 'application/json') {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request: Content-Type must be application/json');
    return;
  }
  console.log(`Request for ${req.url} with ${req.method} received.`);
  if ((req.url === '/' || req.url === "") && req.method === 'GET') {
    await router(req, res); 
  } else if (req.url === '/users/specUser' && req.method === 'GET') {

    await specUserRouter(req, res);
  } else if (req.url === '/login' && req.method === 'POST') {
    await loginRouter(req, res);
  } else if (req.url === '/users' && req.method === 'GET') {
     
    await usersRouter(req, res); 
  } else if (req.url === '/create' && req.method === 'POST') {
    await createRouter(req, res);
    
  } else if (req.url === '/delete' && req.method === 'DELETE') {
    
    await deleteRouter(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }});

server.listen(PORT, hostname, () => {
  console.log(`Server is running on http://${hostname}:${PORT}`);
});