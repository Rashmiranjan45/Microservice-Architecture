import "dotenv/config";
import { app } from "./app.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`API Gateway is running on port ${PORT}`);
  logger.info(
    `Auth Service is running on port ${process.env.AUTH_SERVICE_URL}`,
  );
  logger.info(
    `Post Service is running on port ${process.env.POST_SERVICE_URL}`,
  );
  logger.info(`Redis Url is running on port ${process.env.REDIS_URL}`);
});
