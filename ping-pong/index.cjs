const express = require("express");
const fs = require("fs");

const app = express();
const FILE = "/usr/src/app/shared/pingpong.txt";

let count = 0;
if (fs.existsSync(FILE)) {
  count = parseInt(fs.readFileSync(FILE, "utf8")) || 0;
}

app.get("/pingpong", (_req, res) => {
  count += 1;
  fs.writeFileSync(FILE, count.toString());
  res.send(`pong ${count - 1}`);
});

app.listen(3000);