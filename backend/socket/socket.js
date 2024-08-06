import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);

// creates a new Socket.IO server instance attached to the HTTP server.
const io = new Server(server, {
  // Configures CORS (Cross-Origin Resource Sharing) to allow requests from the specified origin and only allows GET and POST methods.
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// An object that maps user IDs to their corresponding socket IDs. This will help track which socket belongs to which user.
const userSocketMap = {}; //userId: socketId

// Listens for new connections to the server. When a client connects, it triggers this callback function.
io.on("connection", (socket) => {
  console.log("User connected!", socket.id);

  // Retrieves the user ID from the query parameters of the handshake request (the initial connection request).
  const userId = socket.handshake.query.userId;

  // Checks if the user ID is not undefined. If valid, it adds the user ID and socket ID to the userSocketMap.
  if (userId != "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Object.keys() covertes into an array
  // Emits an event named getOnlineUsers to all connected clients, sending them the list of currently online user IDs.
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected!");
  });
});

export { io, server, app };
