const express = require("express");

const router = express.Router();

const {
   createProject,
   getProjects,
} = require("../controllers/project.controller");

const {
   authMiddleware,
} = require("../middlewares/auth.middleware");

router.post(
   "/create",
   authMiddleware,
   createProject
);

router.get("/", getProjects);

module.exports = router;