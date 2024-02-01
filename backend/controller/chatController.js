const Chat = require("../model/chatModel.js");
const User = require("../model/userModel.js");
// access new chat
const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("User id not sent with request");
    return res.status(400);
  }
  var isChat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: error.message,
        error,
      });
    }
  }
};
// fetch chats
const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while fecthing new chats",
      error,
    });
  }
};

module.exports = { accessChat, fetchChats };
