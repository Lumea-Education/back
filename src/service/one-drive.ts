import fs from "fs";
import path from "path";
import { getAccessToken } from "../config/msal";

export async function uploadFile(file: any, uploadDir: string): Promise<any> {
  try {
    const tempFilePath = path.join(uploadDir, file.name);
    await file.mv(tempFilePath);

    const accessToken = await getAccessToken();
    const fileStream = fs.createReadStream(tempFilePath);
    const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/${file.name}:/content`;

    // ✅ `import()`로 동적 로딩하여 `require()` 문제 해결
    const { default: fetch } = await import("node-fetch");

    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": file.mimetype,
      },
      body: fileStream,
    });

    // ✅ 파일 삭제 (중복 제거)
    fs.unlinkSync(tempFilePath);

    if (!response.ok) {
      throw new Error(`Upload unsuccessful: ${response.statusText}`);
    }

    return await response.json(); // ✅ JSON 응답 반환
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error; // ✅ 오류는 상위 함수에서 처리하도록 던짐
  }
}
