const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
require('dotenv').config()
const config = require("./config")
const router = require("./router");

const app = express();

console.log(config)

// DB setup
mongoose.connect(
  config.DATABASE_URI,
  { useNewUrlParser: true }
);

// App setup
app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json({ type: "*/*" }));
router(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("server listening on: ", port);
