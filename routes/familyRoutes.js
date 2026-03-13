const express = require("express");
const router = express.Router();

const {
    createMember,
    getMembers,
    getMemberById
} = require("../controllers/familyController");

router.post("/", createMember);

router.get("/", getMembers);

router.get("/:id", getMemberById);

module.exports = router;