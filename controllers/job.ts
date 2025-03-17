import { Request, Response, NextFunction } from "express";
import JobApplication from "../models/job";
import { getFileUrl, deleteFile } from "../utils/file-helpers";

export async function getApplications(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const applications = await JobApplication.find().select(
      "-resumePath -coverLetterPath"
    );
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
}

export async function getApplication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }
    const result = application.toObject();
    result.resumeUrl = getFileUrl(application.resumePath, req);
    if (application.coverLetterPath) {
      result.coverLetterUrl = getFileUrl(application.coverLetterPath, req);
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function deleteApplication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }
    if (application.resumePath) deleteFile(application.resumePath);
    if (application.coverLetterPath) deleteFile(application.coverLetterPath);
    await application.remove();
    res
      .status(200)
      .json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    next(error);
  }
}
