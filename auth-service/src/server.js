import "dotenv/config";
import { connectDB } from "./db/db.js";
import { app } from "./app.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 3001;

connectDB();

app.listen(PORT, () => {
  logger.info(`Auth Service is running on port ${PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at ${promise} , reason ${reason}`);
});
