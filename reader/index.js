import fs from "fs";
import express from "express";

const app = express();

/* -------------------- */
/* Shared volume config */
/* -------------------- */

const SHARED_DIR = "/usr/src/app/shared";
const IMAGE_PATH = `${SHARED_DIR}/image.jpg`;
const META_PATH = `${SHARED_DIR}/image.json`;

const TEN_MIN = 10 * 60 * 1000;

/* Ensure shared directory exists */
if (!fs.existsSync(SHARED_DIR)) {
  fs.mkdirSync(SHARED_DIR, { recursive: true });
}

/* -------------------- */
/* Image cache logic    */
/* -------------------- */

async function downloadImage() {
  console.log("Downloading new image...");
  const res = await fetch("https://picsum.photos/1200");
  const buffer = Buffer.from(await res.arrayBuffer());

  fs.writeFileSync(IMAGE_PATH, buffer);
  fs.writeFileSync(
    META_PATH,
    JSON.stringify({ timestamp: Date.now() })
  );
}

async function ensureImage() {
  if (!fs.existsSync(IMAGE_PATH) || !fs.existsSync(META_PATH)) {
    return downloadImage();
  }

  const { timestamp } = JSON.parse(fs.readFileSync(META_PATH));
  if (Date.now() - timestamp > TEN_MIN) {
    return downloadImage();
  }
}

/* -------------------- */
/* Routes               */
/* -------------------- */

app.get("/", async (_req, res) => {
  await ensureImage();

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>The project App</title>
        <style>
          body {
            font-family: serif;
            margin: 40px;
          }
          img {
            max-width: 600px;
            display: block;
            margin-bottom: 20px;
          }
          input {
            width: 300px;
            padding: 6px;
            margin-right: 10px;
          }
          button {
            padding: 6px 12px;
          }
        </style>
      </head>
      <body>
        <h1>The project App</h1>

        <img src="/image" />

        <div>
          <input
            type="text"
            maxlength="140"
            placeholder="Write a todo (max 140 chars)"
          />
          <button>Create todo</button>
        </div>

        <ul>
          <li>Learn JavaScript</li>
          <li>Learn React</li>
          <li>Build a project</li>
        </ul>

        <p>DevOps with Kubernetes 2025</p>
      </body>
    </html>
  `);
});

app.get("/image", (_req, res) => {
  res.sendFile(IMAGE_PATH);
});

app.listen(3000, () => {
  console.log("Reader running on port 3000");
});
