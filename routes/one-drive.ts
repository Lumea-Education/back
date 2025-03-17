import express from "express";
import { uploadToOneDrive } from "../controllers/one-drive";

const router = express.Router();

router.post("/upload-onedrive", uploadToOneDrive);

export default router;
