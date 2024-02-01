const express = require("express");
const {
  registerUser,
  authUser,
  uploadImage,
  getAllUsersController,
} = require("../controller/userController");
const protect = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// upload funtion
// storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "pic") {
      cb(null, true);
    } else {
      cb(new multer.MulterError("Unexpected field"));
    }
  },
});
const router = express.Router();
// POST signup
router.post("/", upload.single("pic"), registerUser);
// GET users
router.get("/", protect, getAllUsersController);
// POSTlogin
router.post("/login", authUser);
// router.post("/upload", uploadImag);
module.exports = router;
