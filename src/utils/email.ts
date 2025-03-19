import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
): Promise<boolean> => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 465, // 혹은 포트 587로 변경 가능
      secure: true,
      auth: {
        user: process.env.OUTLOOK_EMAIL,
        pass: process.env.OUTLOOK_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"My App" <${process.env.OUTLOOK_EMAIL}>`,
      to,
      subject,
      text,
    });
    console.log(`📧 Email sent to ${to} ✅`);
    return true;
  } catch (error) {
    console.error(`❌ Email failed to send to ${to}:`, error);
    return false;
  }
};
