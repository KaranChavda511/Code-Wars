// src/middlewares/loggerMiddleware.js
import morgan from "morgan";
import logger from "../utils/logger.js";

const stream = {
  write: (message) => logger.info(message.trim()),
};

const morganMiddleware = morgan(
  ":method :url :status :response-time ms - :res[content-length]",
  { stream }
);

export default morganMiddleware;
