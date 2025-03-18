import express, { Request, Response } from "express";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    console.log("Waitlist entry added:", email);

    return res
      .status(201)
      .json({ success: true, message: "Added to waitlist" });
  } catch (error) {
    console.error("Waitlist error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to add to waitlist" });
  }
});

export default router;
