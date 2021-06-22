const http = require('http');
const app = require('./app');

//create PORT
const port = process.env.PORT || 3001;

//create server
const server = http.createServer(app);

server.listen(port, function() {
    console.log("server listening on "+port);
});