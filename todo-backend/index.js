const express = require("express");
const { Pool } = require("pg");
const { connect } = require("nats");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const NATS_URL = process.env.NATS_URL;

let nc; // global NATS connection

// ---------- PostgreSQL ----------
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432
});

async function waitForDb() {
  while (true) {
    try {
      await pool.query("SELECT 1");
      console.log("✅ Connected to DB");
      break;
    } catch {
      console.log("⏳ Waiting for DB...");
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

// ---------- NATS ----------
async function waitForNats() {
  while (true) {
    try {
      nc = await connect({ servers: NATS_URL });
      console.log("✅ Connected to NATS");
      break;
    } catch {
      console.log("⏳ Waiting for NATS...");
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

// ---------- Routes ----------
app.get("/todos", async (req, res) => {
  const result = await pool.query("SELECT * FROM todos ORDER BY id");
  res.json(result.rows);
});

app.post("/todos", async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).send("Missing content");

  const result = await pool.query(
    "INSERT INTO todos (content) VALUES ($1) RETURNING *",
    [content]
  );

  // 🔥 THIS IS THE IMPORTANT PART
  nc.publish(
    "todos.events",
    JSON.stringify({ message: "A todo was created" })
  );

  res.json(result.rows[0]);
});

app.put("/todos/:id", async (req, res) => {
  const result = await pool.query(
    "UPDATE todos SET done = TRUE WHERE id = $1 RETURNING *",
    [req.params.id]
  );

  nc.publish(
    "todos.events",
    JSON.stringify({ message: "A todo was updated" })
  );

  res.json(result.rows[0]);
});

// ---------- Start ----------
async function start() {
  await waitForDb();
  await waitForNats();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 todo-backend running on port ${PORT}`);
  });
}

start();
