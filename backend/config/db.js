const mongoose = require("mongoose");
const colors = require("colors");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected:${conn.connection.host}`.bold.white);
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

module.exports = connectDB;
