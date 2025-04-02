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

const userSocketMap = {}; // socketId -> userId
const activeUsers = {}; // userId -> socketId

export const getReceiverSocketId = (receiverId) => {
  return activeUsers[receiverId];
};

// Function to broadcast new user to all connected clients
export const broadcastNewUser = (newUser) => {
  io.emit("newUser", newUser);
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    activeUsers[userId] = socket.id;
    userSocketMap[socket.id] = userId;
    broadcastNewUser(userId); // Broadcast new user to all connected clients
  }

  // Handle typing events
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = activeUsers[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId: userId });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = activeUsers[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { senderId: userId });
    }
  });

  // io.emit() is used to emit events to all the clients
  io.emit("getOnlineUsers", Object.keys(activeUsers));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    if (userId) {
      delete activeUsers[userId];
      delete userSocketMap[socket.id];
      io.emit("getOnlineUsers", Object.keys(activeUsers));
    }
  });

  // Listen for when a user comes online
  socket.on("setup", (userId) => {
    socket.join(userId);
    let onlineUsers = [];
    onlineUsers.push(userId);
    io.emit("onlineUsers", onlineUsers);
  });

  // Listen for when a new message is sent
  socket.on("sendMessage", (message) => {
    const recipientSocketId = activeUsers[message.recipientId];
    if (recipientSocketId) {
      socket.to(recipientSocketId).emit("newMessage", message);
    }
  });

  // Listen for when a user disconnects
  socket.on("disconnect", () => {
    let onlineUsers = [];
    onlineUsers = onlineUsers.filter((user) => user !== socket.id);
    io.emit("onlineUsers", onlineUsers);
  });
});

export { app, io, server };
