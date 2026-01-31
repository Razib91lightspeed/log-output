import express from "express";
import fetch from "node-fetch";
import fs from "fs";

const app = express();

/*
  Knative requirement:
  The app must listen on PORT environment variable.
*/
const PORT = process.env.PORT || 8080;

const GREETER_URL = process.env.GREETER_URL || "http://greeter-svc";
const MESSAGE = process.env.MESSAGE || "hello world";
const SHARED_FILE = "/app/shared/file.txt";

app.get("/", async (req, res) => {
  let greeting = "N/A";

  try {
    const r = await fetch(GREETER_URL);
    greeting = await r.text();
  } catch (e) {
    greeting = "greeter unreachable";
  }

  const fileContents = fs.existsSync(SHARED_FILE)
    ? fs.readFileSync(SHARED_FILE, "utf-8")
    : "no file";

  res.send(`
<pre>
Ping / Pongs: OK
env variable: MESSAGE=${MESSAGE}
file contents: ${fileContents}
greetings: ${greeting}
</pre>
`);
});

app.listen(PORT, () => {
  console.log(`Ping-pong running on port ${PORT}`);
});


// gitops proof