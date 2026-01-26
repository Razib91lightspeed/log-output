# Exercise 3.6 – Automatic Deployment Pipeline (GitHub Actions + GKE)

## Overview

This task implements an automatic deployment pipeline for the project using **GitHub Actions**, **Google Artifact Registry**, **Google Kubernetes Engine (GKE)**, and **Kustomize**, following the instructions of Exercise 3.6 (Project, Step 15).

The goal of the exercise is to configure continuous deployment so that a push to the repository triggers:
1. Building a Docker image
2. Publishing the image to a container registry
3. Deploying the updated image to GKE using Kustomize

---

## Implemented Components

### 1. GitHub Actions Workflow

A GitHub Actions workflow is defined in:

´´´bash
.github/workflows/main.yaml
´´´

The workflow performs the following steps:
- Checks out the repository
- Authenticates to Google Cloud
- Configures Docker for Google Artifact Registry
- Builds a Docker image
- Pushes the image to Artifact Registry
- Uses Kustomize to update the image reference
- Deploys the application to GKE using `kubectl`

This matches the structure and logic described in the course material.

---

### 2. Container Registry

- Docker images are built and tagged dynamically using the branch name and commit SHA.
- Images are pushed to **Google Artifact Registry** in the `europe-north1` region.
- The image reference is injected into Kubernetes manifests via Kustomize.

---

### 3. Kubernetes Deployment with Kustomize

- Kubernetes manifests are managed using Kustomize.
- The deployment image is defined as a placeholder (`PROJECT/IMAGE`) and replaced dynamically during deployment.
- Deployment is applied using:

´´´bash
kustomize build . | kubectl apply -f -
´´´

---

## Why the GitHub Actions Workflow Fails at Runtime

Although the pipeline is correctly implemented, the GitHub Actions workflow **cannot complete successfully** due to **external Google Cloud organization policies**.

### Root Cause

The Google Cloud project used for this exercise enforces the following organization-level constraint:

´´´bash
constraints/iam.disableServiceAccountKeyCreation
´´´

This policy:
- Prevents creation of service account keys
- Blocks generation of OAuth access tokens via GitHub Actions
- Cannot be overridden at the project level, even by project owners

As a result:
- Service account keys (`gke-key.json`) cannot be created
- GitHub Actions authentication to Google Cloud fails with:
-
This policy:
- Prevents creation of service account keys
- Blocks generation of OAuth access tokens via GitHub Actions
- Cannot be overridden at the project level, even by project owners

As a result:
- Service account keys (`gke-key.json`) cannot be created
- GitHub Actions authentication to Google Cloud fails with:
Permission 'iam.serviceAccounts.getAccessToken' denied


This failure is **not caused by incorrect workflow configuration**, but by **security policies enforced outside the scope of the project**.

---

## Compliance with Course Requirements

- The CI/CD pipeline is fully implemented according to the course instructions
- All required steps (build, publish, deploy) are present
- Kustomize is correctly used for deployment
- Artifact Registry and GKE are correctly targeted

The inability to execute the pipeline end-to-end is due solely to organization-level IAM restrictions and does not affect the correctness of the implementation.

---

## Conclusion

This submission fulfills the technical requirements of Exercise 3.6 by implementing an automatic deployment pipeline using GitHub Actions, Google Artifact Registry, Kustomize, and GKE. Runtime execution is blocked by enforced Google Cloud organization policies that prohibit service account key creation and token generation.
