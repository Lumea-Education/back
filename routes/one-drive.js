"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const one_drive_1 = require("../controllers/one-drive");
const router = express_1.default.Router();
const asyncHandler = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};
router.post("/upload-onedrive", asyncHandler(one_drive_1.uploadToOneDrive));
exports.default = router;
