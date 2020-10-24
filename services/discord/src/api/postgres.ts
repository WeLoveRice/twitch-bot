import { Pool } from "pg";
import { createLogger } from "../Logger";

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;
export const pool = new Pool({
  host: "postgres",
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD
});

const connect = async () => {
  const logger = createLogger();
  pool.connect();
  pool.on("error", error => {
    logger.error(`postgres error ${error}`);
    process.exit(1);
  });

  pool.on("connect", () => {
    logger.info(`Connected to postgres`);
  });

  await pool.connect();
};

export default { connect };
