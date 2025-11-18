import fs from 'fs/promises';

const filePath = './users.json';

export default async function deleteRouter(req, res) {
    try {
        // read request body
        const body = await new Promise((resolve, reject) => {
            let data = '';
            req.on('data', chunk => (data += chunk));
            req.on('end', () => resolve(data));
            req.on('error', err => reject(err));
        });

        let username;
        try {
            const parsed = body ? JSON.parse(body) : {};
            username = parsed.username;
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON in request body' }));
            return;
        }

        if (!username) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'username is required' }));
            return;
        }

        const dataOld = await fs.readFile(filePath, 'utf-8');
        const users = dataOld ? JSON.parse(dataOld) : [];

        const index = users.findIndex(u => u.username === username);
        if (index === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
            return;
        }

        users.splice(index, 1);
        await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User deleted successfully' }));
        return;
    } catch (error) {
        console.error('Error in deleteRouter:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal server error' }));
        return;
        //used copillot for auto complete
    }
}