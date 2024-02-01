const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcrypt");
const saltRounds = 10; // You can adjust this value
// register user controller
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const pic = req.file ? req.file.filename : null;
    console.log("pic: ", pic);
    console.log(name, email, password);

    if (!name || !email || !password) {
      res.status(400).send({
        success: false,
        message: "Fill the fields",
      });
      return;
    }
    const userExist = await User.findOne({ email });
    console.log("worjing");

    if (userExist) {
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("hashed", hashedPassword);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      pic: req.file.filename, // Store the hashed password
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
      console.log("succ:", _id, name, email, pic, token);
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Failed to create user",
      error,
    });
  }
});
// login
const authUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({ email });
    console.log(user.email, user.password);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
      if (isMatch) {
        res.status(201).send({
          success: true,
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          token: generateToken(user._id),
          message: "User logged in",
        });
      } else {
        res.status(401).send({
          success: false,
          message: "Invalid email or password",
        });
      }
    } else {
      res.status(401).send({
        success: false,
        message: "Invalid email or password",
        error: "Password comparison failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(501).send({
      success: false,
      message: "Failure in logging",
      error,
    });
  }
});
// get all users
const getAllUsersController = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};
// online state
async function storeOnlineStatus(userId, isOnline, io) {
  try {
    // Find the user by ID and update the online status
    await User.findByIdAndUpdate(userId, { isOnline });
    console.log(
      `User ${userId} online status updated to ${
        isOnline ? "online" : "offline"
      }`
    );

    // Emit events to notify other clients about the online status change
    io.emit("user status change", { userId, isOnline });
  } catch (error) {
    console.error(`Error updating user online status: ${error.message}`);
  }
}

module.exports = {
  storeOnlineStatus,
  registerUser,
  authUser,
  getAllUsersController,
};
