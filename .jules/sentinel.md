## 2023-11-20 - Add Next.js Security Headers
**Vulnerability:** Missing default HTTP security headers.
**Learning:** Next.js requires manual configuration of common security headers (like X-Frame-Options, X-Content-Type-Options) in next.config.ts using the async headers() function.
**Prevention:** Include standard security header blocks in next.config.ts for all new Next.js projects as a baseline defense-in-depth measure.
