const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
});

async function initDb() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL
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

app.get("/todos", async (req, res) => {
    const result = await pool.query("SELECT content FROM todos");
    res.json(result.rows);
});

app.post("/todos", async (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).send("Missing content");

    await pool.query("INSERT INTO todos (content) VALUES ($1)", [content]);
    res.status(201).json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`todo-backend running on port ${PORT}`);
});
