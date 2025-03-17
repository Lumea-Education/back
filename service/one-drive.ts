import fs from "fs";
import fetch from "node-fetch";
import path from "path";
import { getAccessToken } from "../config/msal";

export async function uploadFile(file: any, uploadDir: string): Promise<any> {
  const tempFilePath = path.join(uploadDir, file.name);

  await file.mv(tempFilePath);

  const accessToken = await getAccessToken();
  const fileStream = fs.createReadStream(tempFilePath);
  const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/${file.name}:/content`;

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": file.mimetype,
    },
    body: fileStream,
  });

  fs.unlinkSync(tempFilePath);

  if (!response.ok) {
    throw new Error(`Upload unsuccessful: ${response.statusText}`);
  }
  return response.json();
}
