import envConfig from "../envConfig";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: envConfig.get("DATABASE_URL"),
    },
  },
});

export default prisma;
