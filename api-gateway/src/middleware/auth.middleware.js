import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      logger.warn("Token Not Found!");
      return res.status(401).json({
        success: false,
        message: "Token Not Found!",
      });
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error) {
        logger.error("Invalid Token!");
        return res.status(429).json({
          success: false,
          message: "Invalid Token!",
        });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    logger.error("Verify Token Error!");
    return res.status(500).json({
      success: false,
      message: "Verify Token Error!",
    });
  }
};

export { verifyToken };
