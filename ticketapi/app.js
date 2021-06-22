const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../event-ticket/build')));

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../event-ticket/build', 'index.html'));
});

// define a simple route
app.get('/', (req, res) => {
  res.json({
    hasError: false,
    "message": "Welcome to Ticket application. Create tickets quickly. Organize and keep track of all your tickets."
  });
});

//import routes
const event = require('./src/routes/event');
const ticket = require('./src/routes/ticket');

//db connect
require('./src/middleware/db');

//logs the server
app.use(morgan('dev'));
//parse url and json request
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//allow cross origin 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    Response.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({})
  }
  next();
});


//middleware routes handling requests
app.use('/api/event', event);
app.use('/api/ticket', ticket);

//handling errors
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })

})

module.exports = app;