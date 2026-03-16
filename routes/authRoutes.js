const express = require("express");
const router = express.Router();

const {
  register,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;