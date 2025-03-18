import fs from "fs";
import { promises as fsp } from "fs"; // 비동기 fs 기능 유지
import path from "path";
import fetch from "node-fetch";
import { getAccessToken } from "../config/msal.js";

export async function uploadToOneDrive(
  file: any,
  uploadDir: string
): Promise<any> {
  const tempFilePath = path.join(uploadDir, file.name);

  // ✅ 파일 저장 (fs.promises 사용)
  await fsp.writeFile(tempFilePath, file.data);

  const accessToken = await getAccessToken();
  const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/${file.name}:/content`;

  // ✅ 업로드 요청 (fs.createReadStream 사용)
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": file.mimetype,
    },
    body: fs.createReadStream(tempFilePath), // ✅ fs.createReadStream 사용 가능!
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const responseData = await response.json();

  // ✅ 업로드 후 로컬 파일 삭제
  await fsp.unlink(tempFilePath);

  return responseData;
}
