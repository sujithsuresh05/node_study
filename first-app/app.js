const http = require('http');

const server = http.createServer((req, res) => {
    if(req.url === '/'){
        res.write('Hello World');
        res.end();
    }

    if(req.url === '/api/courses'){
        res.write(JSON.stringify([1, 2, 3]));
        res.end();
    }
}
);

server.listen(3000);

console.log('Listening on port 3000...');
// This is a simple server that listens on port 3000 and returns a response based on the URL requested.
// If the URL is '/', it returns 'Hello World'.
// If the URL is '/api/courses', it returns a JSON array of courses.
// This is a simple example of a RESTful API.
// We can use Postman to test this API.
// We can also use the browser to test this API.
// We can use the browser to test this API.



