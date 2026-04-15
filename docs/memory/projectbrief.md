# Project Brief

## Project

`admin-panel` is an Angular-based administrative UI for managing and monitoring a game or platform backend. It provides authenticated access to operational screens such as dashboard, metrics, chat moderation, support, user management, profile, and settings.

## Primary Goals

- Give internal admins a protected web interface for operational work.
- Surface platform health and business/activity metrics.
- Support user administration and moderation workflows.
- Keep the frontend thin by consuming backend admin APIs.

## Current Scope

Implemented or partly implemented:

- Login flow for admin-capable users.
- Auth session persistence and token refresh.
- Admin shell layout with navigation and header/user menu.
- Dashboard backed by `project-overview` and `healthcheck` APIs.
- Admin users list with filtering, sorting, pagination, and details drawer.
- Profile page backed by authenticated profile endpoints.

Prototype or placeholder-heavy:

- Metrics page uses local/mock chart data.
- Chat page is local state only.
- Support, players, and some other sections appear incomplete or placeholder-driven.

## Success Criteria

- Admin-only access is enforced reliably.
- Screens map cleanly to backend API contracts.
- Placeholder views are gradually replaced with real backend integrations.
- The project remains easy to extend with additional admin sections.
