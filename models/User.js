const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["SUPER_ADMIN", "ADMIN", "USER"],
        default: "USER"
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: String,

    resetPasswordToken: String,

    resetPasswordExpire: Date

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);