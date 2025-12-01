import auth from '../../methods/auth.js';
export default async function router(req, res) {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    
    req.on('end', async () => {
        try {
            let credentials;
            try {
                credentials = body ? JSON.parse(body) : {};
            } catch (err) {
                console.error('Invalid JSON body received:', body);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON in request body' }));
                return;
            }

            if (!credentials.username || !credentials.password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'username and password are required' }));
                return;
            }
            console.log('Authenticating user:', credentials.username);
            const token = await auth(credentials.username, credentials.password);

            if (token) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ token:token.token, password: token.password }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid username or password' }));
            }
        }
        catch (error) {
            console.error('Error in login route:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error during authentication' }));
        }
    });
}