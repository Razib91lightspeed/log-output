const http = require("http");
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432,
});

async function checkDb() {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  try {
    // 🔹 Ping-pong main endpoint
    if (req.url === "/") {
      const result = await pool.query(
        "UPDATE counter SET value = value + 1 RETURNING value"
      );
      res.statusCode = 200;
      res.end(`pong ${result.rows[0].value}`);
      return;
    }

    // 🔹 Liveness probe (process alive)
    if (req.url === "/healthz") {
      res.statusCode = 200;
      res.end("alive");
      return;
    }

    // 🔹 Readiness probe (DB dependent)
    if (req.url === "/ready") {
      const ok = await checkDb();
      if (ok) {
        res.statusCode = 200;
        res.end("ready");
      } else {
        res.statusCode = 503;
        res.end("db not ready");
      }
      return;
    }

    res.statusCode = 404;
    res.end("not found");
  } catch (err) {
    console.error("Request error:", err.message);
    res.statusCode = 500;
    res.end("error");
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Ping-pong running on port ${PORT}`);
});
