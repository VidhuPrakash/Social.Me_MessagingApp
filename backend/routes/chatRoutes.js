const express = require("express");

const { accessChat, fetchChats } = require("../controller/chatController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
// accessing chats
router.post("/", protect, accessChat);
// getting chats
router.get("/", protect, fetchChats);

module.exports = router;
