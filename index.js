const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const router = require("./router");

const app = express();

// DB setup
mongoose.connect(
  "mongodb://localhost:27017/lawzen",
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
