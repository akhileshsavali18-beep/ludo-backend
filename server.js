const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app); // 🔴 THIS LINE MUST EXIST

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
app.get("/", (req, res) => {
  res.send("Ludo Backend Running");
});
socket.on("createRoom", ({ username }) => {
  const roomCode = generateRoomCode();

  rooms[roomCode] = {
    host: socket.id,
    players: [{ id: socket.id, username }],
  };

  socket.join(roomCode);

  // 🔴 THIS IS CRITICAL
  socket.emit("roomCreated", {
    roomCode,
    players: rooms[roomCode].players,
  });
});
socket.on("joinRoom", ({ roomCode, username }) => {
  const room = rooms[roomCode];

  if (!room) {
    return socket.emit("error", "Room not found");
  }

  if (room.players.length >= 4) {
    return socket.emit("error", "Room full");
  }

  room.players.push({ id: socket.id, username });
  socket.join(roomCode);

  // 🔴 THIS IS CRITICAL
  io.to(roomCode).emit("playerJoined", room.players);
});
