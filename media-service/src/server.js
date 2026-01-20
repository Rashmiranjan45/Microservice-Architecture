import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./db/db.js";
import logger from "./utils/logger.js";
import { connectRabbitMQ, consumeEvent } from "./utils/rabbitmq.js";
import { handlePostDeleted } from "./eventHandlers/media-event-handlers.js";

const PORT = process.env.PORT || 3003;

connectDB();

async function startServer() {
  try {
    await connectRabbitMQ();

    await consumeEvent("post.deleted", handlePostDeleted);
    app.listen(PORT, () => {
      logger.info(`Media Service is running on port ${PORT}`);
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
