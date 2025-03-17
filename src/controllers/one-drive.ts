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
      return res.status(400).json({ error: "There is no file to upload." });
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
      throw new Error(`upload not succeeded: ${response.statusText}`);
    }
    const data = await response.json();
    fs.unlinkSync(tempFilePath);

    res.status(200).json({
      message: "Your file has been uploaded",
      fileData: data,
    });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
}
