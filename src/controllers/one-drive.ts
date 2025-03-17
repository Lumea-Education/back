import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { request } from "https";
import { getAccessToken } from "../config/msal.js";

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

    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const tempFilePath = path.join(uploadDir, file.name);
    await file.mv(tempFilePath); // Move file to temp path

    // Validate if the file actually exists
    if (!fs.existsSync(tempFilePath)) {
      return res.status(500).json({ error: "File move operation failed." });
    }

    const accessToken = await getAccessToken();
    const fileStream = fs.createReadStream(tempFilePath);
    const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/${file.name}:/content`;

    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": file.mimetype,
      },
    };

    const reqHttps = request(uploadUrl, options, (resHttp) => {
      let data = "";

      resHttp.on("data", (chunk) => (data += chunk));

      resHttp.on("end", () => {
        if (resHttp.statusCode && resHttp.statusCode >= 400) {
          console.error("Upload failed:", data);
          return res
            .status(resHttp.statusCode)
            .json({ error: "Upload failed", details: data });
        }

        console.log("✅ Upload success:", data);
        fs.unlink(tempFilePath, (err) => {
          if (err) console.error("Error deleting temp file:", err);
        });

        res.status(200).json({
          message: "Your file has been uploaded",
          fileData: JSON.parse(data),
        });
      });
    });

    reqHttps.on("error", (error) => {
      console.error("Upload failed:", error);
      next(error);
    });

    fileStream.pipe(reqHttps);
    reqHttps.end(); // ✅ 반드시 호출해야 요청이 완료됨
  } catch (error) {
    console.error("❌ Error:", error);
    next(error);
  }
}
