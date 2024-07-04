const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const routerList = require('./routes/index.rout')

dotenv.config()
const app = express();
const port = process.env.PORT || 4108;


app.use(bodyParser.json());
//auth
// app.use('/api', require('./routes/auth'))
//cerate
app.use('/api', routerList);

  const dev = async () => {
      try {
        mongoose.connect(process.env.MONGO_URI, console.log(`MongoDb connected`));
        app.listen(port, console.log(`Server on port http://localhost:${port}`))
      } catch (e) {
          console.log(e)
      }
  }
  
  dev()

// app.listen(port, () => {
//   console.log(`Server on port http://localhost:${port}`);
// });
