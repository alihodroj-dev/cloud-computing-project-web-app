// src/routes.js
const express = require("express");
const router = express.Router();
const { getPool } = require("./db");

// List all todos
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query("SELECT Id, Title, IsCompleted, CreatedAt FROM Todos ORDER BY CreatedAt DESC");

    res.render("index", { todos: result.recordset });
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).send("Error fetching todos");
  }
});

// Add new todo
router.post("/todos", async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.redirect("/");
  }

  try {
    const pool = await getPool();
    await pool
      .request()
      .input("Title", title.trim())
      .query(`
        INSERT INTO Todos (Title, IsCompleted)
        VALUES (@Title, 0)
      `);

    res.redirect("/");
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).send("Error creating todo");
  }
});

// Toggle completion
router.post("/todos/:id/toggle", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getPool();

    // Get current value
    const current = await pool
      .request()
      .input("Id", id)
      .query("SELECT IsCompleted FROM Todos WHERE Id = @Id");

    if (current.recordset.length === 0) {
      return res.status(404).send("Todo not found");
    }

    const newValue = current.recordset[0].IsCompleted ? 0 : 1;

    await pool
      .request()
      .input("Id", id)
      .input("IsCompleted", newValue)
      .query("UPDATE Todos SET IsCompleted = @IsCompleted WHERE Id = @Id");

    res.redirect("/");
  } catch (err) {
    console.error("Error toggling todo:", err);
    res.status(500).send("Error toggling todo");
  }
});

// Delete todo
router.post("/todos/:id/delete", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    await pool
      .request()
      .input("Id", id)
      .query("DELETE FROM Todos WHERE Id = @Id");

    res.redirect("/");
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).send("Error deleting todo");
  }
});

module.exports = router;