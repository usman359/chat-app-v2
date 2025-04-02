import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {};

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // io.emit() is used to emit events to all the clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on() is used to listen to the events. Can be used both on the server and client
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);

    // Remove user from userSocketMap
    delete userSocketMap[userId];

    // Emit updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // Listen for when a user comes online
  socket.on("setup", (userId) => {
    socket.join(userId);
    onlineUsers.push(userId);
    io.emit("onlineUsers", onlineUsers);
  });

  // Listen for when a user starts typing
  socket.on("typing", ({ recipientId, senderId }) => {
    console.log("Typing:", { recipientId, senderId });
    const recipientSocketId = userSocketMap[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("typing", { senderId });
    }
  });

  // Listen for when a user stops typing
  socket.on("stopTyping", ({ recipientId, senderId }) => {
    console.log("Stop Typing:", { recipientId, senderId });
    const recipientSocketId = userSocketMap[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("stopTyping", { senderId });
    }
  });

  // Listen for when a new message is sent
  socket.on("sendMessage", (message) => {
    const recipientSocketId = userSocketMap[message.recipientId];
    if (recipientSocketId) {
      socket.to(recipientSocketId).emit("newMessage", message);
    }
  });

  // Listen for when a user disconnects
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user !== socket.id);
    io.emit("onlineUsers", onlineUsers);
  });
});

export { io, server, app };
