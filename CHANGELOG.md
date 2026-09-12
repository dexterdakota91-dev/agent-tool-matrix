# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-05-24

### Added
- Next.js 16 App Router & Prisma ORM integration with Neon Serverless Postgres.
- MCP Protocol and OpenAPI 3.1.0 specifications.
- UI components (MatrixClient, ToolCard, StarfieldBackground, EmptyState, Toast).
- Playwright test suites and CI pipeline.

### Changed
- Unified DB Request Pipeline by routing initial loads through a single combined server action to solve WebSocket connection queue delays.

### Deprecated
- Legacy database connection pool configuration.

### Removed
- Deprecated legacy mockup endpoints and redundant data seeding scripts.

### Fixed
- Fixed styling and layout inconsistencies across various screen sizes in the main dashboard views.

### Security
- API Key authentication and rate limiting security middleware.

## [0.0.1] - 2024-04-10

### Added
- Initial project scaffolding.
