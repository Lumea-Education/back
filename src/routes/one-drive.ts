import express from "express";
import { uploadToOneDrive } from "../controllers/one-drive.js";

const router = express.Router();

const asyncHandler =
  (
    fn: (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<any>
  ) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    fn(req, res, next).catch(next);
  };

router.post("/upload-onedrive", asyncHandler(uploadToOneDrive));

export default router;
