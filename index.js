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
// This endpoint is used to check if the server is running properly
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running"
  });
});

// Users API
// Returns a list of dummy users to simulate a basic data response
app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Sanjana" },
    { id: 2, name: "Riya" }
  ]);
});

// Orders API (with validation)
// Accepts order data, validates input, logs events, and returns response
app.post("/orders", (req, res) => {
  const { item } = req.body;

  // Validate request body to ensure required field is present
  if (!item) {
    logger.error("Item is missing in request body");
    return res.status(400).json({
      error: "Item is required"
    });
  }

  // Log successful order creation for observability tracking
  logger.info(`Order created for item: ${item}`);

  // Send success response with order details
  res.status(201).json({
    message: "Order created successfully",
    data: { item }
  });
});

// Start server
// Initializes the Express server on defined port
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});