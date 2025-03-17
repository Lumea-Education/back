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
exports.POST = void 0;
const server_1 = require("next/server");
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const UPLOAD_DIR = path_1.default.join(process.cwd(), "uploads", "volunteer");
function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const formData = yield request.formData();
            const applicationId = (0, uuid_1.v4)();
            const applicationData = {};
            const filePromises = [];
            for (const [key, value] of formData.entries()) {
                if (value instanceof File) {
                    const fileName = `${applicationId}-${key}-${value.name}`;
                    const filePath = path_1.default.join(UPLOAD_DIR, fileName);
                    applicationData[key] = {
                        originalName: value.name,
                        storedPath: filePath,
                        contentType: value.type,
                        size: value.size,
                    };
                    const buffer = Buffer.from(yield value.arrayBuffer());
                    filePromises.push((0, promises_1.writeFile)(filePath, buffer));
                }
                else {
                    applicationData[key] = value;
                }
            }
            yield Promise.all(filePromises);
            console.log("Volunteer application received:", applicationData);
            return server_1.NextResponse.json({
                success: true,
                message: "Volunteer application submitted successfully",
                applicationId,
            }, { status: 201 });
        }
        catch (error) {
            console.error("Error processing volunteer application:", error);
            return server_1.NextResponse.json({
                success: false,
                message: "Failed to process volunteer application",
            }, { status: 500 });
        }
    });
}
exports.POST = POST;
