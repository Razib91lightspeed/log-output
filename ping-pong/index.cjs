const http = require("http");
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS counter (
      id SERIAL PRIMARY KEY,
      value INTEGER NOT NULL
    )
  `);

  const res = await pool.query("SELECT value FROM counter LIMIT 1");
  if (res.rows.length === 0) {
    await pool.query("INSERT INTO counter (value) VALUES (0)");
  }
}

initDb().catch(err => {
  console.error("Database initialization failed:", err.message);
});

const server = http.createServer(async (req, res) => {
  try {
    /* Root path now does ping-pong */
    if (req.url === "/") {
      const result = await pool.query(
        "UPDATE counter SET value = value + 1 RETURNING value"
      );
      res.statusCode = 200;
      res.end(`pong ${result.rows[0].value}`);
      return;
    }

    /* Optional health check (still fine to keep) */
    if (req.url === "/health") {
      res.statusCode = 200;
      res.end("ok");
      return;
    }

    res.statusCode = 404;
    res.end("not found");
  } catch (err) {
    console.error("Request handling error:", err.message);
    res.statusCode = 500;
    res.end("internal error");
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Ping-pong service running on port ${PORT}`);
});
