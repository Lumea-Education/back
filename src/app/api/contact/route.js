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
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const server_1 = require("next/server");
function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield request.json();
            const requiredFields = ["name", "email", "phone", "inquiryType", "message"];
            for (const field of requiredFields) {
                if (!data[field]) {
                    return server_1.NextResponse.json({
                        success: false,
                        message: `Missing required field: ${field}`,
                    }, { status: 400 });
                }
            }
            console.log("Contact request received:", data);
            return server_1.NextResponse.json({
                success: true,
                message: "Contact request submitted successfully",
            }, { status: 201 });
        }
        catch (error) {
            console.error("Error processing contact request:", error);
            return server_1.NextResponse.json({
                success: false,
                message: "Failed to process contact request",
            }, { status: 500 });
        }
    });
}
exports.POST = POST;
