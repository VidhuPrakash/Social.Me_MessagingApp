const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const User = require("./model/userModel");
const path = require("path");

dotenv.config();
connectDB();
const app = express();
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API routes
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 8000;

const onlineUsers = new Set(); // Set to store online users

// Server listen
const server = app.listen(
  PORT,
  console.log(`Server started on port ${PORT}`.bold.blue)
);

// Socket.IO setup
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to Socket.io");

  let VarUserData;

  // User connection
  socket.on("setup", async (userData) => {
    VarUserData = userData;
    // Add user to online users set
    onlineUsers.add(userData._id);
    socket.join(userData._id);
    console.log("User connected:", userData._id);
    io.emit("update users", Array.from(onlineUsers)); // Emit updated online users to all clients
    socket.emit("Connected");
  });

  // Join chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined Room:", room);
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) {
        return;
      }
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  // User disconnection
  socket.on("disconnect", async () => {
    console.log("User disconnected");

    if (VarUserData && VarUserData._id) {
      // Remove user from online users set
      onlineUsers.delete(VarUserData._id);

      // Emit updated online users to all clients
      io.emit("update users", Array.from(onlineUsers));
    }
  });
});
