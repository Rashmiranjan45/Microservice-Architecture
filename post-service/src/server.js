import "dotenv/config";
import { app } from "./app.js";
import logger from "./utils/logger.js";
import { connectDB } from "./db/db.js";
import { connectRabbitMQ } from "./utils/rabbitmq.js";

const PORT = process.env.PORT || 3002;

connectDB();

async function startServer() {
  try {
    await connectRabbitMQ();
    app.listen(PORT, () => {
      logger.info(`Post Service is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to connect server", error);
    process.exit(1);
  }
}

startServer();

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at ${promise} , reason ${reason}`);
});
