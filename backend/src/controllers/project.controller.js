const Project = require("../models/project.model");

const createProject = async (req, res) => {
  try {
    const { projectName, githubRepo, deploymentLink } = req.body;

    const project = await Project.create({
      projectName,
      githubRepo,
      deploymentLink,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Project created",
      project,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createProject,
};