import mongoose, { ConnectOptions } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options: ConnectOptions = {
      dbName: "Lumea-Edu", // 원하는 DB 이름 지정 (선택사항)
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
