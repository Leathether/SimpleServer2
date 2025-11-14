import { promises as fs } from 'fs';

const filePath = './users.json';

export default async function router(req, res) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(content);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error reading file');
    }
}