# System Patterns

## Routing Pattern

- Public route: `/login`
- Protected area: root route using `AdminLayout`
- Child routes lazy-load standalone feature components
- Unknown routes redirect to `/not-found`

## Authentication Pattern

- `AuthService` owns session state via an Angular signal.
- Session is persisted in `localStorage` under `admin_auth_session`.
- `authGuard` blocks access unless the user is authenticated and has an allowed admin role.
- `authInterceptor` attaches bearer tokens and coordinates refresh on expiry or `401`.
- Refresh calls are deduplicated via a shared in-flight observable.

## Data Access Pattern

- Feature components call thin `core/services/*` wrappers.
- Services map directly to backend admin endpoints such as:
  - `auth/login`
  - `auth/refresh`
  - `auth/me`
  - `auth/profile`
  - `project-overview`
  - `users`
- Models in `core/models` describe API contracts and domain types.

## UI Composition Pattern

- Route-level pages own view state and data loading.
- Shared shell components provide consistent framing (`PageShell`, header, navigation, logo, button).
- Features use signals for interactive UI state such as filters, drawers, tabs, loading, and errors.

## Pattern Observations

- The codebase prefers explicit state over abstraction-heavy helpers.
- API-backed screens and purely mocked/demo screens currently coexist.
- There is some duplication of chart/demo datasets between `dashboard` and `metrics`, which is a future cleanup opportunity.
