const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./configDB"); // connect MongoDB
const PORT = process.env.PORT || 5000; // port number
const app = express();
const route = require("./routers/index"); // router impl
var morgan = require("morgan");
app.use(morgan("combined"));

//some middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

//connect to MongoDB
connectDB();
// pass app into router
route(app);

//app listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
