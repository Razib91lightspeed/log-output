import fs from "fs";
import express from "express";


const app = express();

const SHARED_DIR = "/usr/src/app/shared";
const IMAGE_PATH = `${SHARED_DIR}/image.jpg`;
const META_PATH = `${SHARED_DIR}/image.json`;

const TEN_MIN = 10 * 60 * 1000;

if (!fs.existsSync(SHARED_DIR)) {
  fs.mkdirSync(SHARED_DIR, { recursive: true });
}

async function downloadImage() {
  try {
    const res = await fetch("https://picsum.photos/1200");
    if (!res.ok) return;

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(IMAGE_PATH, buffer);
    fs.writeFileSync(META_PATH, JSON.stringify({ timestamp: Date.now() }));
  } catch (err) {
    console.error("Image download failed:", err.message);
  }
}

async function ensureImage() {
  try {
    if (!fs.existsSync(IMAGE_PATH) || !fs.existsSync(META_PATH)) {
      await downloadImage();
      return;
    }

    const { timestamp } = JSON.parse(fs.readFileSync(META_PATH));
    if (Date.now() - timestamp > TEN_MIN) {
      await downloadImage();
    }
  } catch (err) {
    console.error("ensureImage failed:", err.message);
  }
}

app.get("/", async (_req, res) => {
  await ensureImage();
  res.send(`
    <h1>The project App</h1>
    <img src="/image" width="600"/>
    <input maxlength="140" placeholder="Write a todo" />
    <button>Create todo</button>
    <ul>
      <li>Learn JavaScript</li>
      <li>Learn React</li>
      <li>Build a project</li>
    </ul>
    <p>DevOps with Kubernetes 2025</p>
  `);
});

app.get("/image", (_req, res) => {
  if (!fs.existsSync(IMAGE_PATH)) {
    return res.status(404).send("Image not ready yet");
  }

  res.sendFile(IMAGE_PATH);
});


app.listen(3000, () => {
  console.log("Reader running on port 3000");
});
