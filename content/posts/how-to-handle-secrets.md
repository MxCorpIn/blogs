---
title: "How to Handle Secrets: From .env Files to Enterprise Vaults"
description: "A practical guide to managing API keys and credentials-from hobby .env hygiene to secrets managers, CI/CD, Kubernetes, and AI tooling risks."
type: guide
category: tools
tags: [security, secrets, devops, kubernetes, ci-cd]
keywords: [how to handle secrets, env file security, secrets manager, gitleaks, kubernetes secrets, vault dynamic credentials]
publishedAt: 2026-04-29
updatedAt: 2026-07-16
author: ossium
featured: false
draft: false
---

Every few weeks the same question shows up: how do teams share `.env` variables securely? The answer depends on your threat model-but the principles stay the same from side projects to regulated production.

This guide covers a senior-engineer approach for personal and professional work: what goes wrong when secrets leak, three laws of secrets management, right-sized tools by context, CI/CD and Kubernetes pitfalls, and new risks from AI coding assistants.

## The .env file is a loaded gun pointed at your repo

You're moving fast and need API keys accessible. You drop them in `.env`, maybe type `.env` into `.gitignore`, and move on.

Except you forgot `.gitignore` before the first commit. Or a teammate cloned the repo without the rules. Or CI hardcodes secrets. Or a Docker image bakes variables into its layers.

```bash
# What you THINK you did
echo ".env" >> .gitignore && git add . && git commit-m "init"

# What git actually stored... forever
git log--all--full-history-- "**/.env"
# commit a3f9b2c1 (HEAD-> main)
# feat: add payment integration

git show a3f9b2c1:.env
# STRIPE_SECRET_KEY=sk_live_...
# DATABASE_URL=postgresql://admin:password@prod.db:5432/app
# AWS_SECRET_ACCESS_KEY=...
# OPENAI_API_KEY=sk-proj-...

# The .gitignore didn't erase history.
# Those secrets are in every clone, every fork, every mirror.
```

GitGuardian's 2024 report detected over 12.8 million secrets leaked on GitHub in a single year-a 28% year-over-year increase. The most common: API keys, credentials, and private certificates committed directly to repositories.

## What actually happens when secrets leak

Concrete attack vectors-including ones the AI era introduced:

- **Automated secret scanning:** Bots scrape GitHub, GitLab, and npm for high-entropy strings matching known API key patterns. Exposure window: seconds, not hours.
- **Docker layer exposure:** Passing secrets via `ENV` in Dockerfiles bakes them into image layers. A later `RUN unset` does not remove them-values show in `docker history`.
- **Log injection:** Logging request headers, errors, or environment dumps writes secrets to Datadog, Sentry, CloudWatch-your monitoring stack becomes a secret store.
- **Insider and offboarding risk:** A laptop with production `.env` leaves with the person unless you rotate after offboarding.
- **Supply chain attacks:** A compromised dependency can read `process.env` and exfiltrate secrets at runtime.
- **Cloud misconfiguration:** Public S3 buckets, exposed instance metadata, and Kubernetes Secrets that are only base64-encoded (not encrypted) are easy targets.
- **AI coding assistants and context leakage:** Pasting code with secrets into ChatGPT, Claude, Copilot, or Cursor may store session data or send content to third-party APIs.
- **AI-generated hardcoded patterns:** Models trained on public code often emit plausible "example" credentials. Juniors copy them; inconsistent env access patterns get reinforced.
- **LLM prompt injection via environment:** Agents that read env context can be steered to echo secrets into "reasoning" output.

> The `.env` file was designed for local convenience, not production security. We just forgot to stop there.

## The three laws of secrets management

**Law 1: Secrets never live in code.**  
Not in source, comments, commit messages, or test fixtures. Code is version-controlled and permanent. Inject secrets at runtime; never bake them in at write time.

**Law 2: Least privilege, always.**  
Every process, service, and person gets only the secrets it needs. Frontend does not need the DB master password. Scope credentials to minimum viable permission.

**Law 3: Assume breach, rotate regularly.**  
Design as if any secret can be compromised. Prefer automatic rotation, expiring tokens, audit logs, and fast revocation. A secret you cannot rotate quickly is a liability.

## Right tool for the right context

A hobby project does not need HashiCorp Vault. A fintech handling PII does.

### Hobby and personal projects

Threat model: accidental public commit, shared laptop, curious teammate. Goal: good habits without friction.

**1. Non-negotiable `.gitignore` (before any code is added):**

```bash
# Secrets
.env
.env.local
.env.*.local
.env.production
.env.staging

# Never commit these either
*.pem
*.key
*.p12
.secrets/
credentials.json
service-account*.json
```

**2. Commit `.env.example`, not `.env`:**

```ini
# Copy this to .env and fill in real values
# NEVER put real values in .env.example

DATABASE_URL=postgresql://user:password@localhost:5432/mydb
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
JWT_SECRET=generate-with-openssl-rand-hex-32
```

**3. Share via dotenv-vault or 1Password CLI:**

```bash
# dotenv-vault encrypts and syncs .env across the team
npx dotenv-vault@latest new
npx dotenv-vault@latest push
npx dotenv-vault@latest pull

# OR: 1Password CLI - inject at runtime
op run--env-file=.env.template-- node server.js
```

Install **gitleaks** (or git-secrets) as a pre-commit hook. It blocks high-entropy strings and known key patterns before they land in history:

```yaml
# .pre-commit-config.yaml
repos:
 - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
     - id: gitleaks
```

### Startups and small teams

Threat model: everything above, plus offboarding, multi-environment sprawl, contractors, and CI/CD exposure.

Use a managed secrets manager as the single source of truth:

- **AWS Secrets Manager** - rotation for RDS and peers; deep IAM. Best for AWS-native stacks.
- **Doppler** - team UI, per-env configs, CLI injection, CI integrations. Strong DX for startups.
- **Infisical (OSS)** - self-hostable, E2E encrypted. Good open-source option.
- **1Password Teams** - secret references and `op run` injection if the team already uses 1Password.

Inject secrets at **runtime**, never at build time:

```yaml
jobs:
  deploy:
    steps:
     - name: Install Doppler
        run: curl-Ls https://cli.doppler.com/install.sh | sh

     - name: Deploy with secrets
        env:
          DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}
        run: doppler run-- ./deploy.sh

# Only ONE secret (DOPPLER_TOKEN) lives in GitHub.
# Real secrets are fetched at runtime from Doppler.
```

### Enterprise and regulated environments

Threat model: SOC2 / HIPAA / PCI-DSS, audit trails, zero-trust, short-lived credentials, multi-region HA.

HashiCorp Vault is the usual gold standard-dynamic credentials instead of static passwords:

```bash
# App authenticates with its service identity
vault write auth/kubernetes/login \
  role="payment-service" \
  jwt="$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)"

# Short-lived Postgres credential (e.g. 1 hour)
vault read database/creds/payment-readonly
# lease_duration 1h
# username v-payment-svc-abc123
# password A1B-xyz-random-456
```

On cloud platforms, prefer managed identities so there are no long-lived credentials at all. Azure example:

```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

# No client_id / client_secret in env
credential = DefaultAzureCredential()
client = SecretClient(
    vault_url="https://myvault.vault.azure.net/",
    credential=credential,
)

db_password = client.get_secret("prod-db-password").value
# Zero secrets at deploy time; every access is audited and rotatable.
```

## The CI/CD pipeline is your biggest attack surface

Pipelines need secrets to deploy-so they are high-value targets.

- Do not hardcode secrets in pipeline YAML.
- Never print environment variables in logs.
- Never use `set-x` in scripts that handle secrets.
- Avoid Docker build args for secrets-they end up in plaintext history.

```bash
# BAD: bakes the key into every image layer
ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY
# Visible in: docker history, docker inspect, registry pulls
```

Mount secrets at build time instead:

```dockerfile
# syntax=docker/dockerfile:1
RUN--mount=type=secret,id=api_key \
  export OPENAI_API_KEY=$(cat /run/secrets/api_key) && \
  ./setup.sh
```

```bash
docker build--secret id=api_key,src=.env .
```

Use platform secrets (GitHub Actions Secrets, GitLab CI Variables, CircleCI Contexts). Mask values in logs. Scope secrets per environment. Prefer OIDC federation so you do not store long-lived cloud keys:

```yaml
permissions:
  id-token: write # Required for OIDC

steps:
 - name: Configure AWS credentials via OIDC
    uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::123:role/GitHubDeployRole
      aws-region: us-east-1

# No AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY.
# GitHub's OIDC token proves identity; AWS issues short-lived creds.
```

## Kubernetes Secrets are not encrypted by default

Kubernetes Secrets are base64-encoded, not encrypted. Anyone with `kubectl get secret` and a decoder has the credentials:

```bash
kubectl get secret my-app-secrets-o jsonpath='{.data.db-password}'
# cGFzc3dvcmQxMjM=

echo "cGFzc3dvcmQxMjM=" | base64-d
# password123
```

**What to do instead:**

- Enable encryption at rest in etcd via `EncryptionConfiguration` (AES-CBC/GCM with a KMS provider).
- Use External Secrets Operator (ESO) to sync from AWS Secrets Manager, Vault, or Azure Key Vault.
- Use Bitnami Sealed Secrets to commit encrypted manifests safely to Git.
- Strict RBAC: default ServiceAccounts should not read Secrets.
- Pod Security Admission to block privileged pods that could mount all secrets.

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: payment-service-secrets
spec:
  refreshInterval: "1h"
  secretStoreRef:
    name: aws-secrets-manager
    kind: ClusterSecretStore
  target:
    name: payment-secrets
  data:
   - secretKey: db-password
      remoteRef:
        key: prod/payment-service/db
        property: password
```

## AI tools expand the threat surface

Working with AI assistants does not mean abandoning hygiene-it means being explicit about new risks.

- Never paste real credentials into AI chat. Replace with placeholders (`sk_live_abc123` → `sk_live_YOUR_KEY`).
- Configure ignore lists so `.env`, `*.pem`, and credential dirs are not indexed by Cursor, Copilot, etc.
- Review AI-generated code for hardcoded stubs like `hardcoded_password = "admin123"`.
- Be careful with agents that read `os.environ`; adversarial prompts can trigger exfiltration through model output.
- Prefer providers with clear no-training-on-API-data policies when processing sensitive business context.

**For AI engineers building agents:** never inject secrets into system prompts. Use tool functions with scoped permissions instead of full env access. Apply least privilege to the LLM's context, not just your services.

## Checklist

Put this in onboarding docs:

- Add `.env` to `.gitignore` before the first commit
- Commit `.env.example` with placeholders only
- Install gitleaks as a pre-commit hook
- Use a secrets manager instead of sharing `.env` over Slack or email
- Never log env vars or auth headers
- Use OIDC in CI/CD; eliminate long-lived cloud keys
- Use Docker BuildKit `--mount=type=secret` instead of build args
- Enable etcd encryption at rest on Kubernetes
- Sync from a real vault into K8s (e.g. External Secrets Operator)
- Rotate secrets after every employee offboarding
- Never paste real credentials into AI chat sessions
- Least privilege: every service gets only what it needs
- Audit who accessed what and when
