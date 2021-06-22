const mongoose = require('mongoose');

mongoose.Promise = global.Promise

//establish connection to database
mongoose.connect(
  'mongodb+srv://attasiemj:password1234@tickets.dss3n.mongodb.net/tickets?retryWrites=true&w=majority',
  { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true},
  (err) => {
      if (err) return console.log("Error: ", err);
      console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
  }
);
