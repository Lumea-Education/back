import { ConfidentialClientApplication } from "@azure/msal-node";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const msalConfig = {
  auth: {
    clientId: process.env.MS_CLIENT_ID || "",
    authority: `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}`,
    clientSecret: process.env.MS_CLIENT_SECRET || "",
  },
};

if (
  !process.env.MS_CLIENT_ID ||
  !process.env.MS_CLIENT_SECRET ||
  !process.env.MS_TENANT_ID
) {
  throw new Error("Missing Microsoft authentication environment variables!");
}

const msalInstance = new ConfidentialClientApplication(msalConfig);

export async function getAccessToken(): Promise<string> {
  try {
    const result = await msalInstance.acquireTokenByClientCredential({
      scopes: ["https://graph.microsoft.com/.default"],
    });

    if (!result || !result.accessToken) {
      throw new Error("Failed to obtain access token from Microsoft.");
    }

    return result.accessToken;
  } catch (error) {
    console.error("Error acquiring access token:", error);
    throw error;
  }
}
