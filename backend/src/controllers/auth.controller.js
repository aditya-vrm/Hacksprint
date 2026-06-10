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

        // DETERMINE AVATAR
        let profilePicture = "";
        if (gender === "male") {
            profilePicture = "/male-avatar.avif";
        } else if (gender === "female") {
            profilePicture = "/female-avatar.png";
        }

        // CREATE USER
        const user = await userModel.create({
            fullname,
            username,
            email,
            dob,
            gender,
            password: hash,
            profilePicture,
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
            secure: true,
            sameSite: "none",
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
                profilePicture: user.profilePicture,
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
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                dob: user.dob,
                gender: user.gender,
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
        const user = await userModel.findById(req.user.id)
            .populate("followers", "fullname username profilePicture")
            .populate("following", "fullname username profilePicture")
            .select("-password");

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
            secure: true,
            sameSite: "none",
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

// GET ALL USERS OR SEARCH USERS
async function getUsers(req, res) {
    try {
        const { search } = req.query;
        let query = {};
        
        if (search) {
            query = {
                $or: [
                    { username: { $regex: search, $options: "i" } },
                    { fullname: { $regex: search, $options: "i" } },
                ]
            };
        }
        
        // Exclude current logged-in user
        if (req.user && req.user._id) {
            query._id = { $ne: req.user._id };
        }

        const users = await userModel
            .find(query)
            .select("-password")
            .limit(20);

        return res.status(200).json({
            users: users.map(u => ({
                id: u._id,
                name: u.fullname,
                username: u.username.startsWith("@") ? u.username : `@${u.username}`,
                avatarUrl: u.profilePicture || "/logo.png",
                followers: u.followers ? u.followers.length : 0
            }))
        });
    } catch (err) {
        console.log("Error in get users:", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

// GET USER DETAILS BY ID (WITH PROJECTS AND BLOGS)
async function getUserById(req, res) {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId)
            .populate("followers", "fullname username profilePicture")
            .populate("following", "fullname username profilePicture")
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        
        // Find user's projects
        const Project = require("../models/project.model");
        const projects = await Project.find({ owner: userId }).sort({ createdAt: -1 });

        // Find user's blogs
        const Blog = require("../models/blog.model");
        const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            user: {
                id: user._id,
                fullname: user.fullname,
                username: user.username.startsWith("@") ? user.username : `@${user.username}`,
                email: user.email,
                dob: user.dob,
                gender: user.gender,
                profilePicture: user.profilePicture || "/logo.png",
                followers: user.followers || [],
                following: user.following || [],
            },
            projects,
            blogs
        });
    } catch (err) {
        console.log("Error in get user by id:", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// TOGGLE FOLLOW USER RELATIONSHIP
async function toggleFollowUser(req, res) {
    try {
        const { targetUserId } = req.params;
        const currentUserId = req.user.id;

        if (targetUserId === currentUserId.toString()) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        const targetUser = await userModel.findById(targetUserId);
        const currentUser = await userModel.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Initialize arrays if they don't exist
        if (!targetUser.followers) targetUser.followers = [];
        if (!currentUser.following) currentUser.following = [];

        const isFollowing = currentUser.following.some(id => id.toString() === targetUserId);

        if (isFollowing) {
            // Unfollow
            currentUser.following.pull(targetUserId);
            targetUser.followers.pull(currentUserId);
        } else {
            // Follow
            currentUser.following.addToSet(targetUserId);
            targetUser.followers.addToSet(currentUserId);
        }

        await currentUser.save();
        await targetUser.save();

        return res.status(200).json({
            isFollowing: !isFollowing,
            followerCount: targetUser.followers.length,
            followingCount: currentUser.following.length
        });
    } catch (err) {
        console.log("Error in toggle follow user:", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    getUsers,
    getUserById,
    toggleFollowUser,
};