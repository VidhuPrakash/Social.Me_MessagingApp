const Chat = require("../model/chatModel");
const Message = require("../model/messageModel");
const User = require("../model/userModel");

// send message controller
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data passed");
    res.status(400).send({
      success: false,
      message: "Invalid data",
    });
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
      error,
    });
  }
};

// get all message controller
const allMessage = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
      error,
    });
  }
};

module.exports = { sendMessage, allMessage };
