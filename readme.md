# Ping-Pong Application on GKE

This project deploys the Ping-Pong application to **Google Kubernetes Engine (GKE)** as part of the course exercises.

## Description

- The Ping-Pong application is deployed using a **Kubernetes Deployment**
- A **PostgreSQL database** is deployed using a **StatefulSet** with a PersistentVolumeClaim
- The application is exposed externally using a **Service of type LoadBalancer**
- The `/pingpong` endpoint increments and returns a counter stored in PostgreSQL

## Notes

The application was successfully tested on GKE and verified via the external LoadBalancer IP.
After verification, the GKE cluster was deleted to avoid consuming Google Cloud credits, as recommended in the course instructions.

## Proof of Deployment

The following screenshot shows the Ping-Pong application running successfully on Google Kubernetes Engine (GKE) and accessed via the external LoadBalancer IP:

![Ping-Pong running on GKE](image/ex3.1.jpeg)

