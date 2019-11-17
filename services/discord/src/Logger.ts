import winston, { Logger, format, transports, config } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const dailyRotate = new DailyRotateFile({
  filename: "./logs/%DATE%.log",
  datePattern: "YYYY-MM-DD HH:00",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

export const createLogger = (): Logger => {
  return winston.createLogger({
    levels: config.syslog.levels,
    format: format.combine(
      format.timestamp(),
      format.json()
    ),
    transports: [
      new transports.Console({ level: 'error' }),
      dailyRotate
    ]
  });
};
