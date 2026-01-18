import express from "express";
import { authenticateRequest } from "./middlewares/auth.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";
import helmet from "helmet";
import mediaRoutes from "./routes/media.routes.js";
import logger from "./utils/logger.js";

const app = express();

app.use(authenticateRequest);
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  next();
});

app.use("/api/medias", mediaRoutes);

app.use(errorHandler);

export { app };
