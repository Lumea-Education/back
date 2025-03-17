import { ConfidentialClientApplication } from "@azure/msal-node";

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET as string,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);
const graphScopes: string[] = ["https://graph.microsoft.com/.default"];

export async function getAccessToken(): Promise<string> {
  const result = await cca.acquireTokenByClientCredential({
    scopes: graphScopes,
  });
  if (!result || !result.accessToken) {
    throw new Error("Failed to acquire access token");
  }
  return result.accessToken;
}
