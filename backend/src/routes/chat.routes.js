const express = require("express");

const chatController = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// GET ALL CHAT MESSAGES
router.get(
    "/:receiverId",
    authMiddleware.authMiddleware,
    chatController.getMessages
);

module.exports = router;