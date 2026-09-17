# Security Policy

## Supported Versions

Only the latest release on the `main` branch receives active security updates and vulnerability patches.

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x (main) | :white_check_mark: |
| < 0.0.1 | :x:                |

## Reporting a Vulnerability

The security of RESTRO8 and customer/restaurant data is taken seriously. If you discover a security vulnerability, please report it responsibly:

1. **Do not create public GitHub issues** for security vulnerabilities or credential disclosures.
2. Email your findings directly to the repository maintainer: `krisonlama26@gmail.com`.
3. Include:
   - A description of the vulnerability and its potential impact.
   - Exact steps to reproduce or proof-of-concept code.
   - Any relevant logs, network requests, or screenshots (with sensitive credentials redacted).

You will receive an acknowledgment within 48 hours and updates as a patch is prepared and released.

## Security Practices

- **Zero Secret Commits**: Never commit `.env` files, production database connection strings, or service role secrets.
- **Client Key Isolation**: Only anonymous/public publishable keys are permitted in client environment bundles (`VITE_*`). Backend service keys must never be exposed.
- **Row Level Security (RLS)**: When integrating Supabase or any relational backend, Row Level Security must be enabled and enforced on every table.
- **Source Map Suppression**: Production builds do not emit JavaScript source maps to prevent exposure of raw source code.
