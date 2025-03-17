import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../models/user.js";
import connectDB from "../../config/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { name, email, password } = req.body;
      const user = new User({ name, email, password });
      await user.save();
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Error creating user", error });
    }
  } else if (req.method === "GET") {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching users", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
