import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

const app = express();
const server = http.createServer(app);

// creates a new Socket.IO server instance attached to the HTTP server.
const io = new Server(server, {
  // Configures CORS (Cross-Origin Resource Sharing) to allow requests from the specified origin and only allows GET and POST methods.
  cors: {
    origin: "http://localhost:3000", // frontend url
    methods: ["GET", "POST"],
  },
});

// This function takes in a recipientId as an argument.
// It looks up the recipientId in the userSocketMap and returns the associated socket ID.
// If the recipient is connected to the WebSocket server, their socket ID will be found in userSocketMap.
export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};

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

  // sending an event
  // user has seen the message
  // conversationId that we are passing and userId that we are chatting with.
  socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
    try {
      // finding into DB of Message model using conversationId and seen is false and updating buy setting the seen state to true
      await Message.updateMany(
        { conversationId: conversationId, seen: false },
        { $set: { seen: true } }
      );

      // also updating the Conversation model using _id that is conversationId and setting the lastMessage.seen field as true
      await Conversation.updateOne(
        { _id: conversationId },
        { $set: { "lastMessage.seen": true } }
      );

      // sending event to other user using socket id which we are getting from userSocketMap array of userId.
      // .emit()- sending the event with conversationId
      io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
    } catch (error) {
      console.log(error);
    }
  });

  // Disconnecting and removing the user ID and socket ID to the userSocketMap.
  socket.on("disconnect", () => {
    console.log("User disconnected!");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
