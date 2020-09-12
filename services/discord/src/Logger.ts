import winston, { Logger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

export const LOG_DIR = path.join(__dirname, "..", "logs");

export const createLogger = (): Logger => {
  const { Console } = transports;

  const dailyRotate = new DailyRotateFile({
    filename: `${LOG_DIR}/%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d"
  });

  return winston.createLogger({
    format: format.combine(format.timestamp(), format.json()),
    // Error messages also go to console
    transports: [new Console({ level: "error" }), dailyRotate]
  });
};
