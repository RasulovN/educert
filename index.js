const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routerList = require('./routes/index.rout')
const cors = require('cors')
const path = require('path');
const connectDB = require('./config/db');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4108;


app.use(bodyParser.json());
app.use(cors())
app.use(express.json());

app.use(express.static(path.join(__dirname, '/client/dist')));


app.use('/api', routerList);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

  const dev = async () => {
      try {
        // mongoose.connect(process.env.MONGO_URI, console.log(`MongoDb connected`));
        connectDB()
        app.listen(port, console.log(`Server on port http://localhost:${port}`))
      } catch (e) {
          console.log(e)
      }
  }
  
  dev()

// app.listen(port, () => {
//   console.log(`Server on port http://localhost:${port}`);
// });
