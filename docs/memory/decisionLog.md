# Decision Log

## D-001: Use standalone Angular architecture

Status: accepted

The project uses standalone components and application-level providers instead of a module-centric structure. This keeps feature routing and composition lightweight.

## D-002: Keep frontend data access thin

Status: accepted

Feature services are simple wrappers over backend admin endpoints. The app avoids embedding deep business logic in the client.

## D-003: Use signals for local UI/session state

Status: accepted

Angular signals are the main state primitive for auth/session state and page-level interaction state. A larger state library has not been introduced.

## D-004: Persist auth session in local storage and refresh via interceptor

Status: accepted

The current auth model stores the access token and normalized profile in `localStorage`, then refreshes tokens through `/auth/refresh` when needed. This supports smoother admin sessions while keeping request logic centralized.

## D-005: Build product breadth early, integrate depth incrementally

Status: inferred

The route map and feature folders suggest the project is intentionally laying out the full admin information architecture before every section has real backend integration. This is useful for product iteration, but it creates a need to track which screens are production-ready versus prototype-only.
