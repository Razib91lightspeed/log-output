import crypto from "crypto";

const randomString = crypto.randomUUID();

function log() {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp}: ${randomString}`);
}

log();
setInterval(log, 5000);
