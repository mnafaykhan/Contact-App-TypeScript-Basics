import * as winston from "winston";
import dotenv from "dotenv";
dotenv.config();
const { combine, timestamp, printf, colorize, align } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    colorize({ all: true }),
    // colorize({ colors: { error: "red" } }), // To colorize only the "error" log level, modify the colorize line with an object specifying the color for the "error" level.

    timestamp({
      format: "YYYY-MM-DD hh:mm:ss A",
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console({
      level: "silly",
    }),

    new winston.transports.File({
      filename: process.env.ALL_LOGS_FILENAME,
    }),
    new winston.transports.File({
      filename: process.env.ERROR_LOGS_FILENAME,
      level: "error",
    }),
  ],
});
export default logger;
