const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const PORT = process.env.PORT || 8080;
const app = express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(express.static(path.resolve(__dirname, "../")));

app.listen(PORT, err => {
  if (err) {
    console.error(`Error starting server! ${err}`);
  }
  console.log("Successfully started server!");
});
