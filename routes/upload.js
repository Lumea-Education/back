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
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const job_1 = __importDefault(require("../models/job"));
const volunteer_1 = __importDefault(require("../models/volunteer"));
const router = express_1.default.Router();
const uploadDir = path_1.default.join(__dirname, "../uploads");
const jobUploadHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { applicationId } = req.params;
        if (!req.files || (!req.files.resume && !req.files.coverLetter)) {
            res.status(400).json({ success: false, message: "No files provided" });
            return;
        }
        const resumesDir = path_1.default.join(uploadDir, "resumes");
        const coverLettersDir = path_1.default.join(uploadDir, "cover-letters");
        let resumePath = null;
        let coverLetterPath = null;
        if (req.files.resume) {
            const resume = req.files.resume;
            const resumeFileName = `${(0, uuid_1.v4)()}-${resume.name}`;
            resumePath = `/uploads/resumes/${resumeFileName}`;
            yield resume.mv(path_1.default.join(resumesDir, resumeFileName));
        }
        if (req.files.coverLetter) {
            const coverLetter = req.files.coverLetter;
            const coverLetterFileName = `${(0, uuid_1.v4)()}-${coverLetter.name}`;
            coverLetterPath = `/uploads/cover-letters/${coverLetterFileName}`;
            yield coverLetter.mv(path_1.default.join(coverLettersDir, coverLetterFileName));
        }
        const updatedApplication = yield job_1.default.findByIdAndUpdate(applicationId, { resumePath, coverLetterPath }, { new: true });
        if (!updatedApplication) {
            res
                .status(404)
                .json({ success: false, message: "Application not found" });
            return;
        }
        res.status(201).json({
            success: true,
            message: "Files uploaded successfully",
            resumePath,
            coverLetterPath,
            updatedApplication,
        });
    }
    catch (error) {
        console.error("File Upload Error:", error);
        res.status(500).json({ success: false, message: "File upload failed" });
    }
});
const volunteerUploadHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.files || !req.files.resume) {
            res.status(400).json({ success: false, message: "No file provided" });
            return;
        }
        const volunteerDir = path_1.default.join(uploadDir, "volunteer");
        const resume = req.files.resume;
        const volunteerId = (0, uuid_1.v4)();
        const resumeFileName = `${volunteerId}-${resume.name}`;
        const resumePath = `/uploads/volunteer/${resumeFileName}`;
        yield resume.mv(path_1.default.join(volunteerDir, resumeFileName));
        const { firstName, lastName, email, countryCode, areaCode, number, positionName, } = req.body;
        if (!firstName ||
            !lastName ||
            !email ||
            !countryCode ||
            !areaCode ||
            !number) {
            res
                .status(400)
                .json({ success: false, message: "Missing required fields" });
            return;
        }
        const newVolunteer = new volunteer_1.default({
            firstName,
            lastName,
            email,
            phone: {
                countryCode,
                areaCode,
                number,
            },
            resumePath,
            positionName: positionName || "Not specified",
        });
        const savedVolunteer = yield newVolunteer.save();
        res.status(201).json({
            success: true,
            message: "Volunteer application submitted successfully",
            applicationId: savedVolunteer._id,
            resumePath,
        });
    }
    catch (error) {
        console.error("Volunteer Upload Error:", error);
        res
            .status(500)
            .json({ success: false, message: "Volunteer upload failed" });
    }
});
router.post("/careers/upload/:applicationId", jobUploadHandler);
router.post("/careers/volunteer/upload/:applicationId", volunteerUploadHandler);
exports.default = router;
