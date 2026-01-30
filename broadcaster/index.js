const NATS = require("nats");
const fetch = require("node-fetch");

const NATS_URL = process.env.NATS_URL;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const POD_NAME = process.env.POD_NAME || "unknown-pod";
console.log("Broadcaster starting...");

if (!NATS_URL || !WEBHOOK_URL) {
  console.error("Missing env vars");
  process.exit(1);
}

const nc = NATS.connect({ url: NATS_URL });

nc.on("connect", () => {
  console.log(`Broadcaster connected (${POD_NAME})`);

  // QUEUE SUBSCRIPTION (this is the magic)
  nc.subscribe(
    "todos.events",
    { queue: "broadcaster" },
    (msg) => {
      let event;

      try {
        event = JSON.parse(msg.toString());
      } catch (err) {
        console.error("Invalid JSON message", err);
        return;
      }

      const payload = {
        user: "bot",
        message: event.message
      };

      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(() => {
          console.log(
            `Message forwarded by ${POD_NAME}:`,
            payload.message
          );
        })
        .catch((err) => {
          console.error("Webhook send failed", err.message);
        });
    }
  );
});

nc.on("error", (err) => {
  console.error("NATS error:", err);
});

setInterval(() => {}, 1000);