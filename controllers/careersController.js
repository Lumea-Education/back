const JobApplication = require("../models/JobApplication");
const { getFileUrl, deleteFile } = require("../utils/fileHelpers");

// Get all job applications
exports.getApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find().select(
      "-resumePath -coverLetterPath"
    );

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// Get single job application
exports.getApplication = async (req, res, next) => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Add file URLs
    const result = application.toObject();
    result.resumeUrl = getFileUrl(application.resumePath, req);
    if (application.coverLetterPath) {
      result.coverLetterUrl = getFileUrl(application.coverLetterPath, req);
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Delete job application
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Delete associated files
    if (application.resumePath) {
      deleteFile(application.resumePath);
    }

    if (application.coverLetterPath) {
      deleteFile(application.coverLetterPath);
    }

    // Delete from database
    await application.remove();

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
