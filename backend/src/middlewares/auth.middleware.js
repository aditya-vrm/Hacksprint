const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token;

        // check token
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        // verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // find user
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        // attach user to request
        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
}

module.exports = {
    authMiddleware,
};