/*
USAGE:
- An environment variables can be accessed through envConfig if its default value is define here
- An evironment variable's type will be casted using its default value type

IMPORTANT NOTES:
- Secret values MUST NOT be stored in this file
*/
/* eslint-disable max-len */
import dotenv from "dotenv";
import logger from "./libs/logger";
import { Optional } from "./core/type/types";

dotenv.config();

const defaultEnvConfig = {
  // Mysql
  DATABASE_URL: "mysql://root:@127.0.0.1/trumbanthe",
  DB_HOST: "127.0.0.1",
  DB_USER: "root",
  DB_PASSWORD: "",
  DB_NAME: "trumbanthe",

  PAYOS_CLIENT_ID: "",
  PAYOS_API_KEY: "",
  PAYOS_CHECKSUM_KEY: "",
  PAYOS_API_HOST: "",
  PAYOS_CANCEL_URL: "http://localhost:3006",
  PAYOS_RETURN_URL: "http://localhost:3006",

  NODE_MAILER_EMAIL: "minhnhon369@gmail.com",
  NODE_MAILER_PASSWORD: "tdce ycve dunr vzxj",

  NODE_ENV: "local",

  PORT: "3006",
};

type IEnvConfig = Optional<typeof defaultEnvConfig>;

export class EnvConfig {
  private mapping: IEnvConfig = {};

  constructor() {
    const env: IEnvConfig = {};

    Object.entries(defaultEnvConfig).forEach(([key, defaultValue]: any[]) => {
      let value = process.env[key] != null ? process.env[key] : defaultValue;
      const defaultValueType = typeof defaultValue;
      try {
        // Casting types for number (integer only)
        if (defaultValueType === "number") {
          value = parseInt(value, 10);
        }
        // Casting types for boolean
        else if (defaultValueType === "boolean") {
          value =
            typeof value === "boolean"
              ? value
              : ["true", "t", "yes", "y", "1"].includes(
                  value.toString().toLowerCase()
                );
        }
        // Casting types for json string (array + object)
        else if (
          defaultValueType === "object" &&
          typeof value === "string" &&
          defaultValue != null
        ) {
          value = JSON.parse(value);
        }
      } catch (e) {
        logger.info(
          `EnvConfig: Cannot cast type ${defaultValueType} for env "${key}" with value "${value}"`
        );
      }

      env[key as keyof IEnvConfig] = value;
    });

    // Init mapping
    this.mapping = { ...env };
    logger.info("EnvConfig: Initialized");
  }

  get(key: keyof IEnvConfig): any {
    const value = this.mapping[key];
    if (value == null || value === "") {
      logger.warn(`EnvConfig: Value is not set for ${key}`);
    }
    return value;
  }

  get isTest() {
    return this.get("NODE_ENV") === "local";
  }
}

export default new EnvConfig();
