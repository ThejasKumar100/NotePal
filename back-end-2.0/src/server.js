const express = require("express");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const routes = require("./routes");

const app = express();
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json({ type: "application/json" }))
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload())

app.use(routes)

module.exports = app