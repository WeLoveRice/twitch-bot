import winston, { Logger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

export const LOG_DIR = path.join(__dirname, "..", "logs");

const dailyRotate = (fileName: string): DailyRotateFile => {
  return new DailyRotateFile({
    filename: `${LOG_DIR}/${fileName}.log`,
    datePattern: "YYYY-MM-DD HH:00",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d"
  });
};

export const createLogger = (fileName = "%DATE%"): Logger => {
  const { Console } = transports;

  return winston.createLogger({
    format: format.combine(format.timestamp(), format.json()),
    // Error messages also go to console
    transports: [new Console({ level: "error" }), dailyRotate(fileName)]
  });
};
