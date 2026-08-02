# Security Policy

## Reporting a vulnerability

We take security seriously. **Do not open a public issue for a security
vulnerability** - use one of the private channels instead:

- **Preferred:** GitHub's [private vulnerability reporting](https://github.com/MxCorpIn/blogs/security/advisories/new) (available on this repository)
- **Email:** [help@ossium.in](mailto:help@ossium.in) with the subject line `[SECURITY]`

Please include:

- The affected component and version
- A description of the vulnerability
- Steps to reproduce (or a minimal proof of concept)
- Impact and any suggested mitigation, if known

### What happens next

1. We acknowledge your report within **72 hours**.
2. We investigate and confirm the vulnerability.
3. We coordinate a fix and release timeline with you.
4. Once a fix is released, we credit you in the advisory unless you prefer to stay anonymous.

We ask that you do not publicly disclose the issue until we've had a reasonable
window to address it.

## Supported versions

| Version | Supported          |
|-------  |------------------ |
| latest  | ✅ Fully supported |
| older   | ❌ Not supported   |

This project follows [semantic versioning](https://semver.org). We only
guarantee security fixes for the **latest** release - please keep the
repository updated.

## Security-relevant guidelines

This repository is a static blog. The threat surface is intentionally small, but
please note:

- No secrets, API keys, or credentials should ever be committed. If you find one,
  report it immediately and treat it as compromised (rotate it).
- `content/posts/` is authored content, not executable code - but be wary of
  pasting credentials or high-entropy strings from third-party guides into posts;
  they get picked up by secret scanners.
