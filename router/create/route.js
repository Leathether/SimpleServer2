import { promises as fs } from 'fs';

const filePath = './users.json';

export default function router(req, res) {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const user = JSON.parse(body);
        let users = [];
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          users = JSON.parse(content);
        } catch (e) {
          // file may not exist or be empty
        }
        if (!user.username || typeof user.highscore !== 'number') {
            for(const existingUser of users) {
                if (existingUser.username === user.username) {
                    if (parseInt(user.highscore) > existingUser.highscore) {
                        existingUser.highscore = user.highscore;
                        await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Highscore updated' }));
                        return;
                    } else {
                        let placeholder = 0;
                        for (const existingUser of users) {
                            if (existingUser.highscore > placeholder) {
                                placeholder = existingUser.highscore;
                            }
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'No update needed, highscore:' + placeholder }));
                        return;
                    }   
                }

            }
            if (user.username.length < 20 && typeof(user.highscore) === 'number') {
              users.push({ username: user.username, highscore: user.highscore });
              await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'User added' }));
            } else {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Invalid user data' }));
            }
        }
      } catch (error) {
        let content = await fs.readFile(filePath, 'utf-8');
        placeholder = 0;
        for (const user of JSON.parse(content)) {
            if (user.highscore > placeholder) {
                placeholder = user.highscore;
            }
        }
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid request, Highscore: ' + placeholder);
      }
    });
} 