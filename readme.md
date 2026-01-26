# Exercise 3.6 – Automatic Deployment with GitHub Actions and GKE

## Overview

This exercise implements an automatic deployment pipeline using GitHub Actions for a Kubernetes application running on Google Kubernetes Engine (GKE).

The pipeline is triggered on every git push and performs the following actions automatically:
- Builds a Docker image
- Pushes the image to Google Artifact Registry
- Deploys the updated image to the GKE cluster using Kustomize

The goal of this task is to enable continuous delivery from a git push to production without manual steps.

---

## Technologies Used

- GitHub Actions
- Google Kubernetes Engine (GKE)
- Google Artifact Registry
- Docker
- Kustomize
- kubectl
- Workload Identity Federation (OIDC)

---

## CI/CD Pipeline Location

The GitHub Actions workflow is defined in:

.github/workflows/main.yaml

This workflow runs on every push to the repository.

---

## Pipeline Steps

### 1. Trigger

The workflow is triggered on any branch push. This allows testing deployments on non-main branches while keeping main as the primary production branch.

---

### 2. Authentication to Google Cloud

Authentication is handled using Workload Identity Federation (OIDC).
This avoids storing long-lived service account keys in GitHub secrets and follows Google’s recommended security practices.

The workflow requests an OIDC token from GitHub and exchanges it for a short-lived Google Cloud access token.

---

### 3. Docker Image Build

A Docker image is built for the application using Docker Buildx.

The image is built for the linux/amd64 platform to ensure compatibility with GKE nodes.

Each image is tagged uniquely using:
- The branch name
- The Git commit SHA

This ensures every deployment is traceable to a specific commit.

---

### 4. Push to Google Artifact Registry

After building the image, it is pushed to Google Artifact Registry.

Artifact Registry is used instead of Docker Hub to reduce latency and integrate tightly with GKE.

---

### 5. Deployment Using Kustomize

Kustomize is used to manage Kubernetes manifests.

The kustomization.yaml file defines:
- The deployment manifest
- The service manifest
- An image placeholder

During the deployment step, the placeholder image is replaced dynamically with the newly built image tag.

The generated manifests are applied using kubectl, and the rollout status is monitored until completion.

---

## Kubernetes Configuration

Kubernetes configuration is located in the dwk-environments directory.

The kustomization.yaml file includes:
- manifests/deployment.yaml
- manifests/service.yaml

An image placeholder named PROJECT/IMAGE is defined and updated dynamically during deployment.

---

## Result

After completing this exercise:

- A git push automatically triggers:
  - Docker image build
  - Image publish to Artifact Registry
  - Deployment to GKE
- No manual kubectl or Docker commands are required
- Deployment waits until rollout completes successfully
- The setup follows cloud-native CI/CD best practices

---

## Notes

- Workload Identity Federation is used instead of service account keys
- Kustomize simplifies image updates and deployment management
- The pipeline is fully automated and reproducible

---

## Status

Exercise 3.6 completed successfully
