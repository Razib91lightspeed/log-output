import fs from "fs";
import express from "express";
let hasReceivedPingpongData = false;

const app = express();

// ----- ConfigMap values -----
const MESSAGE = process.env.MESSAGE;
const FILE_PATH = "/config/information.txt";

let fileContent = "file not found";
if (fs.existsSync(FILE_PATH)) {
  fileContent = fs.readFileSync(FILE_PATH, "utf-8").trim();
}

// ----- Existing shared storage -----
const SHARED_DIR = "/usr/src/app/shared";
const IMAGE_PATH = `${SHARED_DIR}/image.jpg`;
const META_PATH = `${SHARED_DIR}/image.json`;

const TEN_MIN = 10 * 60 * 1000;

if (!fs.existsSync(SHARED_DIR)) {
  fs.mkdirSync(SHARED_DIR, { recursive: true });
}

// ----- Print required output (Exercise 2.5) -----
console.log(`file content: ${fileContent}`);
console.log(`env variable: MESSAGE=${MESSAGE}`);

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

app.post("/log", express.json(), (req, res) => {
  hasReceivedPingpongData = true;
  res.sendStatus(200);
});

app.get("/ready", (_req, res) => {
  if (hasReceivedPingpongData) {
    res.sendStatus(200);
  } else {
    res.sendStatus(503);
  }
});


