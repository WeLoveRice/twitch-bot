import { createLogger } from "../Logger";
import { default as IORedis } from "ioredis";

export class Redis {
  static connection: IORedis.Redis;

  static connect = () => {
    const logger = createLogger();
    const client = new IORedis(6379, "redis");

    client.on("ready", async () => {
      await client.flushall();
      logger.info("Connected to redis");
    });

    client.on("error", error => {
      logger.error(`redis error: ${error}`);
    });

    return client;
  };

  static getConnection = () => {
    if (Redis.connection) {
      return Redis.connection;
    }
    Redis.connection = Redis.connect();
    return Redis.connection;
  };
}
