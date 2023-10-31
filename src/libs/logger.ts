import { addColors, createLogger, format, Logger, transports } from "winston";

const { combine, colorize, timestamp, json, printf, errors, splat, align } =
  format;

const myCustomFormat = format.combine(
  colorize({ all: true }),
  timestamp({ format: "YY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  align(),
  splat(),
  json(),
  printf((info: any) => {
    const { timestamp: ts, level, message, ...args } = info;
    return `${ts} [${level}]: ${message} ${
      Object.keys(args).length
        ? JSON.stringify({ ...args, extensions: args?.extensions?.code })
        : ""
    }`;
  })
);

addColors({
  info: "bold blue",
  warn: "italic yellow",
  error: "bold red",
  debug: "green",
});

const logger: Logger = createLogger({
  level: "info",
  transports: [new transports.Console({ format: combine(myCustomFormat) })],
});

export default logger;
