import fs from "fs";
import express from "express";

const app = express();


const SHARED_DIR = "/usr/src/app/shared";
const IMAGE_PATH = `${SHARED_DIR}/image.jpg`;
const META_PATH = `${SHARED_DIR}/image.json`;

const TEN_MIN = 10 * 60 * 1000;

// Make sure directory exists
if (!fs.existsSync(SHARED_DIR)) {
  fs.mkdirSync(SHARED_DIR, { recursive: true });
}

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

app.get("/", async (_req, res) => {
  await ensureImage();
  res.send(`
    <h1>The project App</h1>
    <img src="/image" width="600"/>
    <p>DevOps with Kubernetes 2025</p>
  `);
});

app.get("/image", (_req, res) => {
  res.sendFile(IMAGE_PATH);
});

app.listen(3000, () => {
  console.log("Reader running on port 3000");
});
