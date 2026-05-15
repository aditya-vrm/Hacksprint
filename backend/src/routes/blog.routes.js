const express = require("express");

const router = express.Router();

const {
  createBlog,
  getBlogs,
} = require("../controllers/blog.controller");

const {
  authMiddleware,
} = require("../middlewares/auth.middleware");

router.post("/create", authMiddleware, createBlog);

router.get("/", getBlogs);

module.exports = router;