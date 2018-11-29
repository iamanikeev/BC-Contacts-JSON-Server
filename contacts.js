const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const uuid = require('uuid/v4');

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
    res.jsonp(req.query)
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
    if (req.method === 'POST') {
        req.body.id = uuid();
    }
    // Continue to JSON Server router
    next();
});

router.render = (req, res) => {
    // Add pagination for contacts
    if (req.path === '/contacts/') {
        res.jsonp({
            count: res.locals.data.length,
            next: null,
            previous: null,
            results: res.locals.data
        });
    } else {
        res.jsonp(res.locals.data);
    }

};

// Use default router
server.use(router);
server.listen(3000, () => {
    console.log('JSON Server is running')
});