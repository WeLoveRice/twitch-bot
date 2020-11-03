import { Sequelize } from "sequelize";
import { initModels } from "../../models/init-models";
import { createLogger } from "../Logger";

const connect = async () => {
  const {
    POSTGRES_HOST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB
  } = process.env;
  if (!POSTGRES_HOST || !POSTGRES_DB || !POSTGRES_USER || !POSTGRES_PASSWORD) {
    throw new Error("POSTGRES env not set");
  }
  const logger = createLogger();
  const sequelize = new Sequelize(
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    {
      host: POSTGRES_HOST,
      dialect: "postgres",
      logging: msg => logger.info(msg)
    }
  );

  await sequelize.authenticate();
  await sequelize.sync();
  await initModels(sequelize);
};

export default { connect };
