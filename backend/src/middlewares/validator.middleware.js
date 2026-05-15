const { body, validationResult } = require("express-validator");

// HANDLE VALIDATION ERRORS
const respondWithValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    next();
};

// REGISTER USER VALIDATIONS
const registerUserValidations = [
    body("username")
        .isString()
        .withMessage("Username must be a string")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long"),

    body("email")
        .isEmail()
        .withMessage("Invalid email address"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("bio")
        .optional()
        .isString()
        .withMessage("Bio must be a string"),

    body("profilePicture")
        .optional()
        .isString()
        .withMessage("Profile picture must be a string"),

    body("skills")
        .optional()
        .isArray()
        .withMessage("Skills must be an array"),

    body("socialLinks")
        .optional()
        .isObject()
        .withMessage("Social links must be an object"),

    respondWithValidationErrors,
];

// LOGIN VALIDATIONS
const loginValidations = [
    body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email address"),

    body("username")
        .optional()
        .isString()
        .withMessage("Username must be a string"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    respondWithValidationErrors,
];

module.exports = {
    registerUserValidations,
    loginValidations,
};