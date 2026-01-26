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

  const res = await pool.query("SELECT * FROM counter");
  if (res.rows.length === 0) {
    await pool.query("INSERT INTO counter (value) VALUES (0)");
  }
}

initDb().catch(err => {
  console.error("DB init failed:", err);
  process.exit(1);
});

const server = http.createServer(async (req, res) => {
  if (req.url === "/pingpong") {
    const result = await pool.query(
      "UPDATE counter SET value = value + 1 RETURNING value"
    );
    res.end(`pong ${result.rows[0].value}`);
  } else {
    res.end("ok");
  }
});

const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("PORT env var is required");
}

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Ping-pong running on port ${PORT}`);
});