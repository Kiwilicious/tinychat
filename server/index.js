const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const PORT = process.env.PORT || 8080;
const app = express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(express.static(path.resolve(__dirname, "../")));

const server = require("http").Server(app);
const io = require("socket.io")(server);

server.listen(PORT, err => {
  if (err) {
    console.error(`Error starting server! ${err}`);
  }
  console.log("Successfully started server!");
});

io.on("connection", socket => {
  console.log("A user has connected!");
  socket.broadcast.emit("user connect", "User connected!");

  socket.on("user message", msg => {
    socket.broadcast.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A User has disconnected!");
    socket.broadcast.emit("user disconnect", "User disconnected!");
  });
});
