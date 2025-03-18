import express, { Request, Response } from "express";
import User from "../../models/user.js";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("User fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

export default router;
