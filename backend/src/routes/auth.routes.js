 const express = require("express");

const validators = require("../middlewares/validator.middleware");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// REGISTER
router.post(
    "/register",
    validators.registerUserValidations,
    authController.registerUser
);

// LOGIN
router.post(
    "/login",
    validators.loginValidations,
    authController.loginUser
);

// PROFILE
router.get(
    "/me",
    authMiddleware.authMiddleware,
    authController.getCurrentUser
);

// LOGOUT
router.post(
    "/logout",
    authController.logoutUser
);

// SEARCH USERS
router.get(
    "/users",
    authMiddleware.authMiddleware,
    authController.getUsers
);

module.exports = router;