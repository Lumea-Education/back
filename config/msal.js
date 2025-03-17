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
exports.getAccessToken = void 0;
const msal_node_1 = require("@azure/msal-node");
const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
        clientSecret: process.env.CLIENT_SECRET,
    },
};
const cca = new msal_node_1.ConfidentialClientApplication(msalConfig);
const graphScopes = ["https://graph.microsoft.com/.default"];
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield cca.acquireTokenByClientCredential({
            scopes: graphScopes,
        });
        if (!result || !result.accessToken) {
            throw new Error("Failed to acquire access token");
        }
        return result.accessToken;
    });
}
exports.getAccessToken = getAccessToken;
