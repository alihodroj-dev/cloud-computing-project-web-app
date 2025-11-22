// src/db.js
const sql = require("mssql");

// Expect a full SQL connection string in DB_CONNECTION_STRING
// Example (Azure-style):
// Server=tcp:yourserver.database.windows.net,1433;Initial Catalog=YourDb;Persist Security Info=False;User ID=...;Password=...;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;

const connectionString = process.env.DB_CONNECTION_STRING;

if (!connectionString) {
  console.error("ERROR: DB_CONNECTION_STRING is not set.");
}

let pool;

async function getPool() {
  if (pool) return pool;
  pool = await sql.connect(connectionString);
  return pool;
}

module.exports = {
  sql,
  getPool
};