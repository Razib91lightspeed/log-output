import fs from "fs";

const RANDOM_FILE = "/usr/src/app/shared/random.txt";

if (!fs.existsSync(RANDOM_FILE)) {
  fs.writeFileSync(RANDOM_FILE, crypto.randomUUID());
}

setInterval(() => {
  // nothing else required
}, 5000);
