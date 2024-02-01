const express = require("express");
const protect = require("../middleware/authMiddleware");
const { sendMessage, allMessage } = require("../controller/messageControllers");

const router = express.Router();
// send message
router.post("/", protect, sendMessage);
// get message
router.get("/:chatId", protect, allMessage);

module.exports = router;
