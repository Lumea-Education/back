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
exports.uploadFile = void 0;
const fs_1 = __importDefault(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const path_1 = __importDefault(require("path"));
const msal_1 = require("../config/msal");
function uploadFile(file, uploadDir) {
    return __awaiter(this, void 0, void 0, function* () {
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
        fs_1.default.unlinkSync(tempFilePath);
        if (!response.ok) {
            throw new Error(`Upload unsuccessful: ${response.statusText}`);
        }
        return response.json();
    });
}
exports.uploadFile = uploadFile;
