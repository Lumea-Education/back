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
exports.getUploadPath = exports.initializeStorage = void 0;
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const UPLOAD_DIR = path_1.default.join(process.cwd(), "uploads");
function initializeStorage() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, promises_1.mkdir)(UPLOAD_DIR, { recursive: true });
            yield (0, promises_1.mkdir)(path_1.default.join(UPLOAD_DIR, "resumes"), { recursive: true });
            yield (0, promises_1.mkdir)(path_1.default.join(UPLOAD_DIR, "cover-letters"), { recursive: true });
            console.log("File storage initialized successfully");
        }
        catch (error) {
            console.error("Failed to initialize file storage:", error);
            throw error;
        }
    });
}
exports.initializeStorage = initializeStorage;
function getUploadPath(fileType) {
    switch (fileType.toLowerCase()) {
        case "resume":
            return path_1.default.join(UPLOAD_DIR, "resumes");
        case "coverletter":
            return path_1.default.join(UPLOAD_DIR, "cover-letters");
        default:
            return UPLOAD_DIR;
    }
}
exports.getUploadPath = getUploadPath;
