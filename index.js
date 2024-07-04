const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config()
const app = express();
// const port = 3000;
const port = process.env.PORT || 3000;

// MongoDB ga ulanish
// mongoose.connect("mongodb://localhost:27017/educert", 
// console.log(`MongoDb connected`)
// );
mongoose.connect(process.env.MONGO_URI, 
  console.log(`MongoDb connected`)
);

app.use(bodyParser.json());
//auth
app.use('/api', require('./routes/auth'))
//cerate
app.use('/api', require('./routes/index.rout'))

app.listen(port, () => {
  console.log(`Server on port http://localhost:${port}`);
});
