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

// REGISTER VALIDATIONS
const registerUserValidations = [

    body("fullname")
        .isString()
        .withMessage("Fullname must be a string")
        .isLength({ min: 3 })
        .withMessage("Fullname must be at least 3 characters long"),

    body("username")
        .isString()
        .withMessage("Username must be a string")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long"),

    body("email")
        .isEmail()
        .withMessage("Invalid email address"),

    body("dob")
        .notEmpty()
        .withMessage("Date of birth is required"),

    body("gender")
        .isIn(["male", "female", "other"])
        .withMessage("Invalid gender"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("confirmPassword")
        .custom((value, { req }) => {

            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }

            return true;
        }),

    respondWithValidationErrors,
];

// LOGIN VALIDATIONS
const loginValidations = [

    body("email")
        .isEmail()
        .withMessage("Invalid email address"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    respondWithValidationErrors,
];

module.exports = {
    registerUserValidations,
    loginValidations,
};