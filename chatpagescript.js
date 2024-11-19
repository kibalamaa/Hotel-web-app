const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity
  }
});

app.use(cors());
app.use(express.json());

let users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Store user's info when they join
  socket.on('join', (username) => {
    users[socket.id] = username;
    io.emit('user-list', users); // Update all users' list
  });

  // Handle messages
  socket.on('message', (messageData) => {
    io.emit('message', messageData); // Send message to all users
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('user-list', users);
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
