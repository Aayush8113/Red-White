const http = require('http');
const fs = require('fs').promises;

const routes = {
    '/': { file: 'index.html', type: 'text/html' },
    '/about': { file: 'about.html', type: 'text/html' },
    '/style.css': { file: 'style.css', type: 'text/css' }
};

const server = http.createServer(async (req, res) => {
    const route = routes[req.url];

    if (route) {
        try {
            const data = await fs.readFile(route.file);
            res.writeHead(200, { 'Content-Type': route.type });
            res.end(data);
        } catch {
            res.writeHead(500);
            res.end("Server Error");
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
            <div style="text-align: center; font-family: sans-serif; padding: 50px;">
                <h1 style="color: #e74c3c;">404 - Page Not Found</h1>
                <a href="/" style="display: inline-block; margin-top: 20px; padding: 10px 20px; text-decoration: none; color: white; background-color: #3498db; border-radius: 5px;">Return Home</a>
            </div>
        `);
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});