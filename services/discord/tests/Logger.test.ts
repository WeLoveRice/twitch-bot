import moment from "moment";
import { LOG_DIR } from "./../src/Logger";
import { createLogger } from "../src/Logger";
import { Logger } from "winston";
import { access, constants, readFile, unlinkSync } from "fs";
import path from "path";

const date = moment().format("YYYY-MM-DD HH:00");
const logFilePath = path.join(LOG_DIR, `TEST.log.${date}`);
const logger: Logger = createLogger("TEST");

afterAll(() => {
  unlinkSync(logFilePath);
});

describe("Test logger", () => {
  it("can see log file", done => {
    access(`${logFilePath}`, constants.F_OK, err => {
      expect(err).toBeFalsy();
      done();
    });
  });

  it("can log info messages", done => {
    logger.info("Info test");
    readFile(`${logFilePath}`, (err, data) => {
      expect(err).toBeFalsy();
      expect(data.includes("Info test")).toBe(true);
      done();
    });
  });
});
