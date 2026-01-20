import "dotenv/config";
import { app } from "./app.js";
import logger from "./utils/logger.js";
import { connectDB } from "./db/db.js";
import { connectRabbitMQ, consumeEvent } from "./utils/rabbitmq.js";
import {
  handlePostCreated,
  handlePostDeleted,
} from "./eventHandlers/search-event-handlers.js";

const PORT = process.env.PORT || 3002;

connectDB();

async function startServer() {
  try {
    await connectRabbitMQ();
    await consumeEvent("post.created", handlePostCreated);
    await consumeEvent("post.deleted", handlePostDeleted);
    app.listen(PORT, () => {
      logger.info(`Search Service is running on port ${PORT}`);
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
