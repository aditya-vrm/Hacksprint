const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        bio: {
            type: String,
            default: ''
        },
        profilePicture: {
            type: String,
            default: ''
        },
        skills: [
            {
                type: String
            }
        ],
        socialLinks: {
            github: { type: String, default: '' },
            linkedin: { type: String, default: '' },
            website: { type: String, default: '' }
        },
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
