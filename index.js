import express from "express";
import fetch from "node-fetch";
import fs from "fs";

const app = express();

const GREETER_URL = process.env.GREETER_URL || "http://greeter-svc";

app.get("/", async (req, res) => {
  let greeting = "N/A";

  try {
    const r = await fetch(GREETER_URL);
    greeting = await r.text();
  } catch (e) {
    greeting = "greeter unreachable";
  }

  const message = process.env.MESSAGE || "hello world";
  const fileContents = fs.existsSync("/app/shared/file.txt")
    ? fs.readFileSync("/app/shared/file.txt", "utf-8")
    : "no file";

  res.send(`
    <pre>
Ping / Pongs: OK
env variable: MESSAGE=${message}
file contents: ${fileContents}
greetings: ${greeting}
    </pre>
  `);
});

app.listen(3000, () => {
  console.log("Log-output running on port 3000");
});


// gitops proof