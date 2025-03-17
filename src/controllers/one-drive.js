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
exports.uploadToOneDrive = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const msal_1 = require("../config/msal");
function uploadToOneDrive(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.files || !req.files.file) {
                return res.status(400).json({ error: "There is no file to upload." });
            }
            const file = req.files.file;
            const uploadDir = path_1.default.join(__dirname, "../uploads");
            const tempFilePath = path_1.default.join(uploadDir, file.name);
            yield file.mv(tempFilePath);
            const accessToken = yield (0, msal_1.getAccessToken)();
            const fileStream = fs_1.default.createReadStream(tempFilePath);
            const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/${file.name}:/content`;
            const response = yield (0, node_fetch_1.default)(uploadUrl, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": file.mimetype,
                },
                body: fileStream,
            });
            if (!response.ok) {
                throw new Error(`upload not succeeded: ${response.statusText}`);
            }
            const data = yield response.json();
            fs_1.default.unlinkSync(tempFilePath);
            res.status(200).json({
                message: "Your file has been uploaded",
                fileData: data,
            });
        }
        catch (error) {
            console.error("Error:", error);
            next(error);
        }
    });
}
exports.uploadToOneDrive = uploadToOneDrive;
