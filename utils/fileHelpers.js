const fs = require("fs");
const path = require("path");

// Initialize upload directories
const initializeUploadDirectories = () => {
  const dirs = [
    path.join(__dirname, "../uploads"),
    path.join(__dirname, "../uploads/resumes"),
    path.join(__dirname, "../uploads/cover-letters"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Get file URL from file path
const getFileUrl = (filePath, req) => {
  if (!filePath) return null;

  const relativePath = filePath.replace(path.join(__dirname, ".."), "");
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  return `${baseUrl}${relativePath.replace(/\\/g, "/")}`;
};

// Delete file
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
};

module.exports = {
  initializeUploadDirectories,
  getFileUrl,
  deleteFile,
};
