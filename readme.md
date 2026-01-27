# Exercise 4.1 – Readiness Probes

This task implements readiness probes for both applications:

- **Ping-pong** becomes ready only when it can connect to the PostgreSQL database.
- **Log-output** becomes ready only after it has successfully received data from the Ping-pong application.

## Verification (Without Database)

Before deploying the database StatefulSet, the system behaves as expected:

- Ping-pong cannot resolve or connect to the database and remains **Not Ready (0/1)**.
- Log-output is running, but only **one container is ready (1/2)** because it has not yet received data from Ping-pong.

The following screenshot demonstrates the correct state:

- `log-output`: **1/2 READY**
- `ping-pong`: **0/1 READY**
- Ping-pong logs show database connection failures (`ENOTFOUND postgres`)
- Log-output readiness endpoint is not available yet

### Proof of Completion

![Exercise 4.1 – Readiness probes without database](image/ex4.1.png)

## Expected Behavior After Adding Database

Once the database is deployed and Ping-pong establishes a connection:

- Ping-pong automatically becomes **Ready (1/1)**
- Ping-pong sends data to Log-output
- Log-output readiness probe passes and becomes **Ready (2/2)**

This confirms that both readiness probes work as intended.