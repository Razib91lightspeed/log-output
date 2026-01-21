import fs from "fs";
import crypto from "crypto";

const random = crypto.randomUUID();
const file = "/usr/src/app/shared/log.txt";

setInterval(() => {
  const line = `${new Date().toISOString()}: ${random}\n`;
  fs.appendFileSync(file, line);
}, 5000);
