const http = require("http");
const { Pool } = require("pg");

/* =====================================================
   PostgreSQL connection pool
   ===================================================== */
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432,
});

/* =====================================================
   Initialize database schema (idempotent)
   ===================================================== */
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

/* Initialize DB but do NOT crash the app if it fails */
initDb().catch(err => {
  console.error("Database initialization failed:", err.message);
});

/* =====================================================
   HTTP server (GKE Ingress compatible)
   ===================================================== */
const server = http.createServer(async (req, res) => {
  try {
    /* Health check endpoint (MANDATORY for GKE Ingress) */
    if (req.url === "/" || req.url === "/health") {
      res.statusCode = 200;
      res.end("ok");
      return;
    }

    /* Ping-pong endpoint */
    if (req.url === "/pingpong") {
      const result = await pool.query(
        "UPDATE counter SET value = value + 1 RETURNING value"
      );
      res.statusCode = 200;
      res.end(`pong ${result.rows[0].value}`);
      return;
    }

    /* Unknown path */
    res.statusCode = 404;
    res.end("not found");
  } catch (err) {
    console.error("Request handling error:", err.message);
    res.statusCode = 500;
    res.end("internal error");
  }
});

/* =====================================================
   Start server
   ===================================================== */
const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Ping-pong service running on port ${PORT}`);
});