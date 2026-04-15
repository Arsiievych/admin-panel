# Product Context

## Users

Primary users are internal operators with elevated roles:

- `SUPER_ADMIN`
- `ADMIN`
- `MODERATOR`

The frontend explicitly treats those roles as eligible for admin panel access.

## User Needs

- Log in securely and stay signed in without constant re-authentication.
- Monitor system health and high-level operational KPIs.
- Review and manage platform users.
- Update their own profile and credentials.
- Access moderation and support tooling from a single admin surface.

## Product Boundaries

- This app is an internal/admin client, not the public-facing product.
- Business logic is expected to live mostly in backend APIs.
- The frontend is responsible for access control at the UX level, but backend authorization must remain the source of truth.

## Current Product Reality

- The dashboard is the most operationally meaningful screen today.
- User management is the most complete CRUD-style admin workflow in the codebase.
- Several routes exist to establish information architecture before full backend integration is finished.

## Likely Near-Term Product Work

- Replace remaining mock data in metrics/chat/support-related screens.
- Add richer moderation/support actions.
- Tighten error handling and empty states for API-backed pages.
