import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { getAccessToken } from "../config/msal";

export async function uploadToOneDrive(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "업로드할 파일이 없습니다." });
    }
    const file = req.files.file as any;
    const uploadDir = path.join(__dirname, "../uploads");
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

    if (!response.ok) {
      throw new Error(`업로드 실패: ${response.statusText}`);
    }
    const data = await response.json();
    fs.unlinkSync(tempFilePath);

    res.status(200).json({
      message: "파일이 OneDrive에 업로드되었습니다.",
      fileData: data,
    });
  } catch (error) {
    console.error("OneDrive 업로드 에러:", error);
    next(error);
  }
}
