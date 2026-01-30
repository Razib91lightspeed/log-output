import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import express from "express";

const app = express();

const SHARED_DIR = "/app/shared";
const IMAGE_PATH = path.join(SHARED_DIR, "image.jpg");
const META_PATH = path.join(SHARED_DIR, "image.meta.json");

/* Ensure directory exists */
if (!fs.existsSync(SHARED_DIR)) {
  fs.mkdirSync(SHARED_DIR, { recursive: true });
}

const TTL = 10 * 60 * 1000; // 10 minutes

async function fetchNewImage() {
  const res = await fetch("https://picsum.photos/1200");
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(IMAGE_PATH, Buffer.from(buffer));

  const meta = {
    lastFetched: Date.now(),
    expiredOnce: false
  };
  fs.writeFileSync(META_PATH, JSON.stringify(meta));
}

function loadMeta() {
  if (!fs.existsSync(META_PATH)) return null;
  return JSON.parse(fs.readFileSync(META_PATH, "utf-8"));
}

app.get("/", async (req, res) => {
  if (!fs.existsSync(IMAGE_PATH)) {
    await fetchNewImage();
  } else {
    const meta = loadMeta();
    const age = Date.now() - meta.lastFetched;

    if (age > TTL) {
      if (!meta.expiredOnce) {
        meta.expiredOnce = true;
        fs.writeFileSync(META_PATH, JSON.stringify(meta));
      } else {
        await fetchNewImage();
      }
    }
  }

  res.send(`
    <html>
      <body>
        <h2>Cached image</h2>
        <img src="/image" width="600"/>
      </body>
    </html>
  `);
});

app.get("/image", (req, res) => {
  res.sendFile(IMAGE_PATH);
});

app.listen(3000, () => {
  console.log("Log-output running on port 3000");
});

// gitops proof