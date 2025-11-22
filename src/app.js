// src/app.js
const expressLayouts = require("express-ejs-layouts");
const express = require("express");
const path = require("path");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "layout");

// Routes
app.use("/", routes);

// Basic health check
app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});