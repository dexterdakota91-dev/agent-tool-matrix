## 2026-09-12 - Strict Constraint Adherence in Content Sanitization
**Vulnerability:** Naive regex replacements and overly broad file modifications violated explicit negative constraints and potentially polluted build environments.
**Learning:** When strict constraints dictate editing only a single file, script-based patching that modifies package locks, configuration, or unrelated component files creates severe pipeline vulnerabilities and pollutes the workspace.
**Prevention:** Strictly utilize in-place precise edits or carefully constrained scripts that verify against targeted scopes, entirely avoiding indiscriminate commands like `npm install` when they update `package-lock.json` in violation of explicit task rules. Always run `git checkout HEAD <forbidden_files>` to revert accidental changes.

## 2026-09-15 - Hardcoded Development API Key Fallback in Production
**Vulnerability:** A static developer token fallback (`dev_static_key_12345`) in `src/lib/auth-api.ts` was hardcoded, allowing potential authentication bypass in production if `DEV_AGENT_TOKEN` was unset in environment variables.
**Learning:** Fallback defaults for dev tokens or secret credentials in authentication logic must strictly gate on explicit non-production environments (`NODE_ENV === 'development' || NODE_ENV === 'test'`).
**Prevention:** Always restrict fallback developer secrets to non-production environments (`development`/`test`) and enforce explicit environment variable configuration (`DEV_AGENT_TOKEN`) in production environments.
