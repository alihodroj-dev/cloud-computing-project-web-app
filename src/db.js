// src/db.js
const sql = require("mssql");

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