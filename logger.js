const winston = require("winston");
const { ElasticsearchTransport } = require("winston-elasticsearch");

const esTransport = new ElasticsearchTransport({
  level: "info",
  clientOpts: {
    node: "http://localhost:9200",
  },
});

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "app.log" }),
    esTransport,
  ],
});

module.exports = logger;