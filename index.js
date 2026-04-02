require("./tracing");

const morgan = require("morgan");
const logger = require("./logger");
const cors = require("cors");
const helmet = require("helmet");

const express = require("express");
const app = express();

// Enable basic security and request handling
app.use(cors());       
app.use(helmet());     
app.use(express.json());

// Logging middleware to track all incoming requests
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

// Health API
// Used to check if server is running properly
app.get("/healthz", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running"
  });
});

// Users API
// Returns static list of users (dummy data)
app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Sanjana" },
    { id: 2, name: "Riya" }
  ]);
});

// Orders API
// Validates input and logs order creation
app.post("/orders", (req, res) => {
  const { item } = req.body;

  // Check if item is provided
  if (!item) {
    logger.error("Item is missing in request body");
    return res.status(400).json({
      error: "Item is required"
    });
  }

  // Log order creation for monitoring
  logger.info(`Order created for item: ${item}`);

  // Send success response
  res.status(201).json({
    message: "Order created successfully",
    data: { item }
  });
});


//  PRODUCT APIs 

// Returns list of products
// This simulates product data without database
app.get("/api/products", (req, res) => {
  const products = [
    { id: 1, name: "Laptop", category: "electronics" },
    { id: 2, name: "Shoes", category: "fashion" }
  ];

  res.json(products);
});

// Get product by ID
// Finds product from dummy list using ID
app.get("/api/products/:id", (req, res) => {
  const products = [
    { id: 1, name: "Laptop" },
    { id: 2, name: "Shoes" }
  ];

  const product = products.find(p => p.id == req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});


// CART APIs

let cart = [];

// Add item to cart
// Stores product in memory with orgId
app.post("/api/cart", (req, res) => {
  const { productId, quantity, orgId } = req.body;

  // Validate required fields
  if (!productId || !quantity || !orgId) {
    return res.status(400).json({ error: "All fields required" });
  }

  cart.push({ productId, quantity, orgId });

  res.json({ message: "Item added to cart" });
});

// Get cart by orgId
// Returns all items for a specific organization
app.get("/api/cart/:orgId", (req, res) => {
  const items = cart.filter(item => item.orgId == req.params.orgId);

  if (items.length === 0) {
    return res.status(404).json({ error: "Cart not found" });
  }

  res.json(items);
});


// Start server
// Runs Express server on given port
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




const { trace } = require("@opentelemetry/api");

const tracer = trace.getTracer("checkout-tracer");

// CHECKOUT API

app.post("/api/checkout", (req, res) => {
  const span = tracer.startSpan("checkout-process");

  const { orgId, items } = req.body;

  // Validation span
  const validationSpan = tracer.startSpan("validation", { parent: span });

  if (!orgId || !items || items.length === 0) {
    logger.error("Invalid checkout request");
    validationSpan.end();
    span.end();

    return res.status(400).json({ error: "Invalid request" });
  }

  validationSpan.end();

  // Simulate async processing
  setTimeout(() => {

    const processSpan = tracer.startSpan("processing", { parent: span });

    const fail = Math.random() < 0.1;

    if (fail) {
      logger.error("Checkout failed due to random error");

      processSpan.end();
      span.end();

      return res.status(500).json({ error: "Checkout failed" });
    }

    logger.info(`Checkout successful for orgId: ${orgId}`);

    processSpan.end();
    span.end();

    res.json({
      message: "Order placed successfully",
      orderId: Math.floor(Math.random() * 1000)
    });

  }, 1000);
});