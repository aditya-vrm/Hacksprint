const express = require("express");

const router = express.Router();

const {
   createProject,
} = require("../controllers/project.controller");

const {
   authMiddleware,
} = require("../middlewares/auth.middleware");

router.post(
   "/create",
   authMiddleware,
   createProject
);

module.exports = router;