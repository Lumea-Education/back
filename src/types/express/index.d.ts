import * as expressFileUpload from "express-fileupload";

declare global {
  namespace Express {
    interface Request {
      files?: expressFileUpload.FileArray | null; // 🔥 null 추가하여 기존 타입과 일치
    }
  }
}

export {}; // 🔥 TypeScript 전역 선언을 위한 필수 코드!
