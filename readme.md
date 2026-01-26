# Exercise 3.7 – Separate Environment for Each Branch

## Overview

This exercise extends the CI/CD pipeline created in the previous tasks by introducing **separate Kubernetes environments for each Git branch**.

Each branch is deployed into its own Kubernetes namespace, allowing isolated testing and development environments.
The `main` branch continues to be deployed into a fixed production namespace called `project`.

This approach closely matches real-world deployment pipelines that use feature branching.

---

## Goal of the Task

- Deploy each Git branch into its own Kubernetes namespace
- Keep the `main` branch deployed in the `project` namespace
- Use GitHub Actions, Kustomize, and Google Kubernetes Engine
- Ensure deployments happen automatically on every push

---

## Key Concept

The namespace is determined dynamically based on the branch name:

- If the branch is `main`, the namespace is `project`
- Otherwise, the namespace name equals the branch name

This allows multiple versions of the application to run simultaneously without interfering with each other.

---

## Kubernetes Configuration Location

The Kubernetes configuration for this task is located in the `dwk-environments` directory.

This directory contains:
- A `kustomization.yaml` file
- Deployment and service manifests under the `manifests` directory

The `kustomization.yaml` file acts as the entry point for Kustomize and is modified dynamically during deployment.

---

## CI/CD Pipeline Changes

The GitHub Actions workflow was updated so that during deployment it:

1. Determines recognized branch name from GitHub
2. Maps `main` to the `project` namespace
3. Uses the branch name as namespace for all other branches
4. Creates the namespace if it does not already exist
5. Switches the Kubernetes context to the selected namespace
6. Updates the namespace inside `kustomization.yaml`
7. Replaces the image placeholder with the newly built image
8. Applies the manifests and waits for rollout completion

---

## Deployment Behavior

- Each branch push triggers a new deployment
- Each branch has its own isolated namespace
- The `main` branch always represents the stable environment
- Feature branches can be tested independently
- No manual kubectl commands are required

---

## Result

After completing this exercise:

- Multiple branch deployments can coexist in the cluster
- Each branch has a fully isolated environment
- Production remains stable in the `project` namespace
- The deployment pipeline is fully automated
- The solution matches the course requirements exactly

---

## Notes

- Branch names are assumed to be valid Kubernetes namespace names
- Existing namespaces are reused safely
- Namespace creation errors are handled gracefully
- This setup mirrors professional CI/CD workflows

---


## Status

Exercise 3.7 completed successfully.
