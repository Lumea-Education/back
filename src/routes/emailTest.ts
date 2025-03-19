import { sendEmail } from "../utils/email.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// ✅ 환경 변수 로드
dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.argv[1] === __filename) {
  (async () => {
    console.log("📨 Sending test email...");

    console.log("📌 Checking ENV variables:");
    console.log("OUTLOOK_EMAIL:", process.env.OUTLOOK_EMAIL);
    console.log("OUTLOOK_PASSWORD:", process.env.OUTLOOK_PASSWORD);

    if (!process.env.OUTLOOK_EMAIL || !process.env.OUTLOOK_PASSWORD) {
      console.error("❌ Missing email credentials. Check .env.local file.");
      process.exit(1);
    }

    const success = await sendEmail(
      process.env.TEST_EMAIL as string,
      "Manual Test Email 🚀",
      "This is a manual test email to verify that email sending is working."
    );

    if (success) {
      console.log("✅ Email sent successfully!");
    } else {
      console.log("❌ Email failed to send.");
    }
  })();
}
