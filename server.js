const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const rooms = {};

function generateRoomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // CREATE ROOM
  socket.on("createRoom", ({ username }) => {
    const roomCode = generateRoomCode();

    rooms[roomCode] = {
      host: socket.id,
      players: [{ id: socket.id, username }],
    };

    socket.join(roomCode);

    socket.emit("roomCreated", {
      roomCode,
      players: rooms[roomCode].players,
    });
  });

  // JOIN ROOM
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

    io.to(roomCode).emit("playerJoined", room.players);
  });
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
