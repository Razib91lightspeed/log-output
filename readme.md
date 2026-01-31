# Course Repository Structure

This course project is organized into multiple folders, each connected to a separate Git repository.

When starting the course, each exercise or chapter was implemented independently and pushed to its own repository. Later I realized a single monorepo would have been cleaner, but the structure below reflects the historical development of the work.

Each folder is therefore an independent project with its own Git history.

## Folder Overview

### dummy-site-crd
Contains Kubernetes CRD experiments and small test deployments used during early exercises for learning custom resources and basic manifests.

```bash
https://github.com/Razib91lightspeed/dummy-site-crd
```

### log-output

```bash
https://github.com/Razib91lightspeed/log-output
```
Main application repository.
Includes:
- Ping-pong service
- Broadcaster
- Greeter
- Kubernetes manifests
- Gateway / Ingress
- Knative (serverless) exercises

Most later course tasks and production-style deployments are implemented here.

### log-output-gitops

```bash
https://github.com/Razib91lightspeed/log-output-gitops
```

GitOps-focused exercises.
Contains:
- Declarative manifests
- Environment overlays
- Deployment automation experiments
Used to practice GitOps workflows and infrastructure-as-code concepts.

### todo-app

```bash
https://github.com/Razib91lightspeed/todo-app
```

Independent example application.
Used for:
- Dockerization
- Kubernetes basics
- Service exposure
- Database integration

Serves as a simpler demo project separate from the main system.

## Note

If starting again, I would combine everything into a single monorepo for simpler submission and organization. However, each repository remains fully functional and self-contained for clarity and modularity.

All exercises requested in the course are implemented within their respective folders.

# ENd