// src/app.js
require("dotenv").config(); // For local dev; not needed in Azure
const express = require("express");
const path = require("path");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));


// View engine
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

// Static files (if you add CSS later)
app.use(express.static(path.join(__dirname, "..", "public")));

// Routes
app.use("/", routes);

// Basic health check
app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});