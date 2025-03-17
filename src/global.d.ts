import * as expressFileUpload from "express-fileupload";

declare global {
  namespace Express {
    interface Request {
      files?: expressFileUpload.FileArray | null;
    }
  }
}

export {}; // TypeScript 전역 선언 적용을 위해 필수!
