// src/routes.js
const express = require("express");
const router = express.Router();
const { getPool } = require("./db");

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query("SELECT Id, Title, Description, Severity, IsResolved, CreatedAt FROM [dbo].[Issues] ORDER BY CreatedAt DESC");

    res.render("index", { issues: result.recordset });
  } catch (err) {
    console.error("Error fetching issues:", err);
    res.status(500).send("Error fetching issues");
  }
});

router.post("/issues", async (req, res) => {
  const { title, description, severity } = req.body;
  if (!title || !title.trim()) {
    return res.redirect("/");
  }

  // Validate severity
  const validSeverities = ["Low", "Medium", "High"];
  const issueSeverity = validSeverities.includes(severity) ? severity : "Low";

  try {
    const pool = await getPool();
    await pool
      .request()
      .input("Title", title.trim())
      .input("Description", description ? description.trim() : "")
      .input("Severity", issueSeverity)
      .query(`
        INSERT INTO Issues (Title, Description, Severity, IsResolved)
        VALUES (@Title, @Description, @Severity, 0)
      `);

    res.redirect("/");
  } catch (err) {
    console.error("Error creating issue:", err);
    res.status(500).send("Error creating issue");
  }
});

router.post("/issues/:id/resolve", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getPool();

    // Check if issue exists
    const current = await pool
      .request()
      .input("Id", id)
      .query("SELECT IsResolved FROM Issues WHERE Id = @Id");

    if (current.recordset.length === 0) {
      return res.status(404).send("Issue not found");
    }

    // Mark as resolved
    await pool
      .request()
      .input("Id", id)
      .query("UPDATE Issues SET IsResolved = 1 WHERE Id = @Id");

    res.redirect("/");
  } catch (err) {
    console.error("Error resolving issue:", err);
    res.status(500).send("Error resolving issue");
  }
});

module.exports = router;