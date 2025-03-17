"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getFileUrl = exports.initializeUploadDirectories = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function initializeUploadDirectories() {
    const dirs = [
        path_1.default.join(__dirname, "../uploads"),
        path_1.default.join(__dirname, "../uploads/resumes"),
        path_1.default.join(__dirname, "../uploads/cover-letters"),
        path_1.default.join(__dirname, "../uploads/images"),
    ];
    dirs.forEach((dir) => {
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
    });
}
exports.initializeUploadDirectories = initializeUploadDirectories;
function getFileUrl(filePath, req) {
    if (!filePath)
        return null;
    const relativePath = filePath.replace(path_1.default.join(__dirname, ".."), "");
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return `${baseUrl}${relativePath.replace(/\\/g, "/")}`;
}
exports.getFileUrl = getFileUrl;
function deleteFile(filePath) {
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.unlinkSync(filePath);
        return true;
    }
    return false;
}
exports.deleteFile = deleteFile;
