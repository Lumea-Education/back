import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { getAccessToken } from "../config/msal.js"; // msal 관련 코드
dotenv.config({ path: ".env.local" });

// Define an interface for the token result
interface TokenResult {
  accessToken: string;
  expiresOn: Date;
}

async function createTransporter() {
  const tokenResultRaw = await getAccessToken();
  let tokenResult: TokenResult;

  if (typeof tokenResultRaw === "string") {
    // Assuming the string is JSON with the correct properties
    const parsedToken = JSON.parse(tokenResultRaw);
    // Ensure expiresOn is a Date object
    tokenResult = {
      accessToken: parsedToken.accessToken,
      expiresOn: new Date(parsedToken.expiresOn),
    };
  } else {
    // Otherwise, assume it's already the correct object
    tokenResult = tokenResultRaw;
  }

  // Convert expiresOn to epoch ms if it's a Date
  const expires =
    tokenResult.expiresOn instanceof Date
      ? tokenResult.expiresOn.getTime()
      : undefined;

  return nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      type: "OAuth2",
      user: process.env.OUTLOOK_EMAIL,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      accessToken: tokenResult.accessToken,
      expires, // 토큰 만료 시간 (밀리초)
      // refreshToken: process.env.OAUTH_REFRESH_TOKEN, // 사용하지 않으려면 생략
    },
    tls: {
      ciphers: "SSLv3",
    },
  });
}

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
): Promise<boolean> => {
  try {
    const transporter = await createTransporter();
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
