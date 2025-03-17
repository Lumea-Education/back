import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import path from "path";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Import configuration and utilities
import { corsOptions } from "./config/cors";
import connectDB from "./config/db";
import { initializeUploadDirectories } from "./utils/file-helpers";

// Connect to MongoDB
connectDB();

// Initialize file upload directories
initializeUploadDirectories();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
import careersRouter from "./routes/careers";
import volunteerRouter from "./routes/volunteer";
import contactRouter from "./routes/contact";
import waitlistRouter from "./routes/waitlist";
import uploadRouter from "./routes/upload";
import oneDriveRouter from "./routes/one-drive";

app.use("/api/careers", careersRouter);
app.use("/api/volunteer", volunteerRouter);
app.use("/api/contact", contactRouter);
app.use("/api/waitlist", waitlistRouter);
app.use("/api", uploadRouter);
app.use("/api", oneDriveRouter);

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Default route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the backend API!" });
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Global error handler:", err);
  res.status(500).json({ success: false, error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// MongoDB connection event logging
mongoose.connection.on("connected", () => {
  const dbName = mongoose.connection.db?.databaseName || "Unknown";
  console.log(`✅ MongoDB connected! Current DB: ${dbName}`);
});
