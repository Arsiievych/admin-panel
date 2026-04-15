# Tech Context

## Stack

- Angular `21.x`
- Standalone components and `provideRouter`
- Angular signals for local state
- RxJS for HTTP flows
- `ng2-charts` + `chart.js` for charts
- npm as package manager
- Vitest via Angular's unit test builder

## Project Shape

- `src/app/core`: guards, interceptors, services, models
- `src/app/features`: route-level pages/features
- `src/app/layouts`: admin shell layout pieces
- `src/app/shared/ui`: reusable UI primitives
- `src/environments`: environment-specific API endpoints

## Runtime Assumptions

- Development API base URL: `http://localhost/api/admin`
- Development healthcheck URL: `http://localhost/healthcheck`
- Production environment file still uses example URLs and likely needs real deployment values.

## Key Technical Choices

- No NgModule-heavy structure; the app uses standalone Angular patterns.
- No global state library such as NgRx; state is kept in services/signals per feature.
- A shared `ApiService` centralizes URL construction and common HTTP options.
- Auth is handled through local session storage plus refresh-token requests with `withCredentials`.

## Tooling Notes

- Build: `npm run build`
- Dev server: `npm start`
- Tests: `npm test`
- Formatting is guided by `prettier` config in `package.json`.
