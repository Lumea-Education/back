"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.getApplication = exports.getApplications = void 0;
const job_1 = __importDefault(require("../models/job"));
const file_helpers_1 = require("../utils/file-helpers");
function getApplications(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const applications = yield job_1.default.find().select("-resumePath -coverLetterPath");
            res.status(200).json({
                success: true,
                count: applications.length,
                data: applications,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getApplications = getApplications;
function getApplication(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const application = yield job_1.default.findById(req.params.id);
            if (!application) {
                return res
                    .status(404)
                    .json({ success: false, message: "Application not found" });
            }
            const result = application.toObject();
            result.resumeUrl = (0, file_helpers_1.getFileUrl)(application.resumePath, req);
            if (application.coverLetterPath) {
                result.coverLetterUrl = (0, file_helpers_1.getFileUrl)(application.coverLetterPath, req);
            }
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getApplication = getApplication;
function deleteApplication(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const application = yield job_1.default.findById(req.params.id);
            if (!application) {
                return res
                    .status(404)
                    .json({ success: false, message: "Application not found" });
            }
            if (application.resumePath)
                (0, file_helpers_1.deleteFile)(application.resumePath);
            if (application.coverLetterPath)
                (0, file_helpers_1.deleteFile)(application.coverLetterPath);
            yield application.remove();
            res
                .status(200)
                .json({ success: true, message: "Application deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.deleteApplication = deleteApplication;
