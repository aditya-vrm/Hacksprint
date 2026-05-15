const Message = require("../models/message.model");

// GET CHAT MESSAGES
async function getMessages(req, res) {
    try {
        const { receiverId } = req.params;

        const messages = await Message.find({
            $or: [
                {
                    sender: req.user._id,
                    receiver: receiverId,
                },
                {
                    sender: receiverId,
                    receiver: req.user._id,
                },
            ],
        })
            .populate("sender", "username")
            .populate("receiver", "username")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            messages,
        });
    } catch (error) {
        console.log("Error in get messages:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

module.exports = {
    getMessages,
};