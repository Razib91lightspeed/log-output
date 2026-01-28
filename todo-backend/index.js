const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.path}`);
    next();
});

const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
});

// ---- Database init & migration ----
async function initDb() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      done BOOLEAN DEFAULT FALSE
    )
  `);
}

async function waitForDb() {
    while (true) {
        try {
            await initDb();
            console.log("Connected to todo database");
            break;
        } catch (err) {
            console.log("Waiting for todo database...");
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}

waitForDb();

// ---- Routes ----

// GET all todos
app.get("/todos", async (req, res) => {
    const result = await pool.query(
        "SELECT id, content, done FROM todos ORDER BY id ASC"
    );
    res.json(result.rows);
});

// CREATE todo
app.post("/todos", async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).send("Missing content");
    }

    if (content.length > 140) {
        return res.status(400).send("Todo must be at most 140 characters");
    }

    const result = await pool.query(
        "INSERT INTO todos (content, done) VALUES ($1, FALSE) RETURNING *",
        [content]
    );

    res.status(201).json(result.rows[0]);
});

// MARK todo as done
app.put("/todos/:id", async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "UPDATE todos SET done = TRUE WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rowCount === 0) {
        return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
});

// ---- Start server ----
app.listen(PORT, "0.0.0.0", () => {
    console.log(`todo-backend running on port ${PORT}`);
});
