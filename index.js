require("./tracing");

const morgan = require("morgan");
const logger = require("./logger");


const express = require("express");
const app = express();

app.use(express.json());


app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

// Health API
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running"
  });
});

// Users API
app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Sanjana" },
    { id: 2, name: "Riya" }
  ]);
});

// Orders API (with validation)
app.post("/orders", (req, res) => {
  const { item } = req.body;

  if (!item) {
    logger.error("Item is missing in request body");
    return res.status(400).json({
      error: "Item is required"
    });
  }

  logger.info(`Order created for item: ${item}`);

  res.status(201).json({
    message: "Order created successfully",
    data: { item }
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});