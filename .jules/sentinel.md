
## 2024-05-24 - [Cleartext Database Connection String in Logs]
**Vulnerability:** Prisma initialization logged the cleartext connection string and process environment variables via `console.log`.
**Learning:** Initializing connections or environments safely requires caution to avoid accidental exposure of secrets in runtime or build logs, which are often indexed or stored insecurely.
**Prevention:** Avoid using `console.log` for database initialization configurations, environment variables, or connection strings. Use secure configuration management or logger abstractions that redact secrets automatically.
