import express from "express";
import { authenticateRequest } from "./middlewares/auth.middleware.js";
import Redis from "ioredis";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";
import searchRoutes from "./routes/search.routes.js";

const app = express();
const redisClient = new Redis();

app.use(authenticateRequest);
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Recived ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

app.use("/api/search", searchRoutes);

app.use(errorHandler);

export { app };
