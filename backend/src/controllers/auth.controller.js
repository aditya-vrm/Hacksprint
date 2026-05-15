const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



async function registerUser(req, res) {
    try {

        const {
            fullname,
            username,
            email,
            dob,
            gender,
            password,
        } = req.body;

        // CHECK EXISTING USER
        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ email }, { username }],
        });

        if (isUserAlreadyExists) {
            return res.status(409).json({
                message: "Username or email already exists",
            });
        }

        // HASH PASSWORD
        const hash = await bcrypt.hash(password, 10);

        // CREATE USER
        const user = await userModel.create({
            fullname,
            username,
            email,
            dob,
            gender,
            password: hash,
        });

        // GENERATE TOKEN
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        // SET COOKIE
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        // RESPONSE
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                dob: user.dob,
                gender: user.gender,
                role: user.role,
            },
        });

    } catch (err) {

        console.log("Error in register user:", err);

        return res.status(500).json({
            message: "Internal server error",
        });

    }
}

// LOGIN USER
async function loginUser(req, res) {
    try {
        const { username, email, password } = req.body;

        // find user
        const user = await userModel
            .findOne({
                $or: [{ email }, { username }],
            })
            .select("+password +email");

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        // generate token
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        // set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profilePicture: user.profilePicture,
                skills: user.skills,
                socialLinks: user.socialLinks,
                role: user.role,
            },
        });
    } catch (err) {
        console.log("Error in login user:", err);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

// GET CURRENT USER PROFILE
async function getCurrentUser(req, res) {
    try {
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            user,
        });
    } catch (err) {
        console.log("Error in get current user:", err);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

async function logoutUser(req, res) {
    try {
        // clear cookie
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: new Date(0),
        });

        return res.status(200).json({
            message: "Logout successful",
        });
    } catch (err) {
        console.log("Error in logout user:", err);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
};