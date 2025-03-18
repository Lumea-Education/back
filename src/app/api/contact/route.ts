import express, { Request, Response } from "express";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    console.log("Contact form submitted:", { name, email, message });

    return res
      .status(201)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send message" });
  }
});

export default router;
