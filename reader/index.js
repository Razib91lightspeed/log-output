import fs from "fs";
import http from "http";

const file = "/usr/src/app/shared/log.txt";
const port = 3000;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  if (fs.existsSync(file)) {
    res.end(fs.readFileSync(file, "utf-8"));
  } else {
    res.end("No logs yet");
  }
}).listen(port);
