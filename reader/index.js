const express = require("express");
const fs = require("fs");

const app = express();

const LOG_FILE = "/usr/src/app/shared/log.txt";
const PING_FILE = "/usr/src/app/shared/pingpong.txt";

app.get("/", (_req, res) => {
  let logs = "";
  let pingCount = 0;

  if (fs.existsSync(LOG_FILE)) {
    logs = fs.readFileSync(LOG_FILE, "utf8");
  }

  if (fs.existsSync(PING_FILE)) {
    pingCount = fs.readFileSync(PING_FILE, "utf8").trim();
  }

  res.send(`${logs}\nPing / Pongs: ${pingCount}`);
});

app.listen(3000, () => {
  console.log("Log reader running on port 3000");
});
