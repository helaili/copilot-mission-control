# Copilot Mission Control

A comprehensive platform for managing and orchestrating GitHub Copilot across your organization.

## Overview

Copilot Mission Control provides centralized governance, monitoring, and analytics for GitHub Copilot deployments. Streamline policy enforcement, track usage patterns, and optimize AI-assisted development across your teams.

## GitHub OAuth

Authentication uses `nuxt-auth-utils` with GitHub OAuth. Configure the GitHub OAuth app callback URL as:

```text
http://localhost:3000/auth/github
```

For deployed environments, use the equivalent production URL and set `NUXT_OAUTH_GITHUB_REDIRECT_URL` if the runtime cannot infer it.

The app expects these environment variables:

```bash
NUXT_OAUTH_GITHUB_CLIENT_ID=your-github-oauth-client-id
NUXT_OAUTH_GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
NUXT_SESSION_PASSWORD=at-least-32-characters
```
