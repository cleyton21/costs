const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const port = process.env.PORT || 5000;

// Add custom middlewares
server.use(middlewares);

// Remove /api prefix from the request URL
server.use((req, res, next) => {
    if (req.url.startsWith('/api/')) {
        req.url = req.url.replace('/api/', '/');
    }
    next();
});

// Add custom routes
server.get('/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date() });
});

// Error handling middleware
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Use the router
server.use('/', router);

// Start the server
server.listen(port, 'localhost', () => {
    console.log(`JSON Server is running on http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
