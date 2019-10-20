import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const dailyRotate = new DailyRotateFile({
  filename: "./logs/%DATE%.log",
  datePattern: "YYYY-MM-DD HH:mm",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d"
});

export const logger = winston.createLogger({
  transports: [dailyRotate]
});
