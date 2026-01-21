import http from "http";
import crypto from "crypto";

const PORT = process.env.PORT || 3000;
const randomString = crypto.randomUUID();

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    const timestamp = new Date().toISOString();
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`${timestamp}: ${randomString}`);
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
