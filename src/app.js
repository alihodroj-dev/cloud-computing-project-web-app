// src/app.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing for forms
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

// Use express-ejs-layouts
app.use(expressLayouts);
app.set("layout", "layout"); // this will look for views/layout.ejs

// Static files (if any)
app.use(express.static(path.join(__dirname, "..", "public")));

// Routes
app.use("/", routes);

// Health check
app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});