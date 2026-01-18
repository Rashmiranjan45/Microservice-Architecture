import winston from "winston";

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(), // enable for message templating
    winston.format.json()
  ),
  defaultMeta: { service: "Post-service" },
  transports: [ // output destination for logs
    new winston.transports.Console({ // log will appear in console
      format: winston.format.combine(
        winston.format.colorize(), // colorize the log
        winston.format.simple() // 
      ),
    }),
    new winston.transports.File({ filename: "error.log", level: "error" }), //error log
    new winston.transports.File({ filename: "combined.log" }), // combine log
  ],
});

export default logger;
