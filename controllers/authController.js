const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

//Register  Users 

exports.register = async (req, res) => {

    try {

        const { name, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            verificationToken
        });

        const verifyURL = `http://localhost:5000/api/auth/verify/${verificationToken}`;

        await sendEmail(
            email,
            "Email Verification",
            `Click to verify your account: ${verifyURL}`
        );

        res.json({
            message: "Registration successful. Please verify your email."
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};
// login 
exports.login = async (req, res) => {
    try {
  
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({
          message: "User not found"
        });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid password"
        });
      }
  
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      res.json({
        token,
        user
      });
  
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };


// Email Verification 

exports.verifyEmail = async (req, res) => {

    try {

        const user = await User.findOne({
            verificationToken: req.params.token
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid token"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;

        await user.save();

        res.json({
            message: "Email verified successfully"
        });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }
};

/// Forget password 

exports.forgotPassword = async (req, res) => {

    try {

        const user = await User.findOne({
            email: req.body.email
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = resetToken;

        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        const resetURL =
            `http://localhost:3000/reset-password/${resetToken}`;

        await sendEmail(
            user.email,
            "Password Reset",
            `Reset your password: ${resetURL}`
        );

        res.json({
            message: "Password reset email sent"
        });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }
};


//Reset Password 
exports.resetPassword = async (req, res) => {

    try {

        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token"
            });
        }

        const hashedPassword = await bcrypt.hash(
            req.body.password,
            10
        );

        user.password = hashedPassword;

        user.resetPasswordToken = undefined;

        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({
            message: "Password reset successful"
        });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }
};