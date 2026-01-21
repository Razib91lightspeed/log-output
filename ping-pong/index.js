import http from "http";

const PORT = process.env.PORT || 3000;
let counter = 0;

const server = http.createServer((req, res) => {
  if (req.url === "/pingpong") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`pong ${counter}`);
    counter++;
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`Ping-pong server running on port ${PORT}`);
});
