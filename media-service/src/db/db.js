import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async function () {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "social-media-micro-service",
    });
    logger.info("Connected to mongodb");
  } catch (error) {
    logger.error("Mongodb connection error", e);
  }
};

export { connectDB };
