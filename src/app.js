// src/app.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/", routes);

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});