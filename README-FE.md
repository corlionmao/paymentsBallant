# Ledgerline Payment Frontend

Ledgerline is a payment operations SPA for monitoring and managing payment transactions through the companion .NET Clean Architecture Web API. It provides a secure login flow, a responsive transaction ledger, payment creation with client-side idempotency, pagination, and actions for completing or cancelling pending payments.

## Purpose

The application gives payment operators one focused workspace to:

- Authenticate with the backend and maintain a JWT session.
- Review payment amount, currency, status, identifiers, and creation date.
- Create payments using a generated correlation ID and account ID.
- Complete or cancel pending payments.
- Navigate larger payment collections through client-side pagination.
- See backend RFC 7807 Problem Details messages in the relevant UI state.

## Technology

- Angular 17+
- Standalone components and lazy-loaded routes
- Strict TypeScript and Angular template checking
- Angular Signals with `OnPush` change detection
- Reactive Forms
- Functional route guard and HTTP interceptor
- RxJS and Angular `HttpClient`

## Prerequisites

- Node.js compatible with Angular 17
- npm
- The backend API running from `C:\source\payments` at `http://localhost:5080`

## Installation and development

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm start
```

Open [http://localhost:4200](http://localhost:4200).

The Angular development server proxies `/api` requests to `http://localhost:5080` through [proxy.conf.json](proxy.conf.json). This keeps browser requests same-origin during local development and avoids local CORS preflight issues. Restart the dev server after changing `angular.json` or `proxy.conf.json`.

Demo credentials:

```text
Username: admin
Password: Password123!
```

## Available commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Angular development server |
| `npm run build` | Create a production build in `dist/payment-front` |
| `npm run watch` | Build continuously using the development configuration |
| `npm test` | Run the Angular test command once |

## Backend contract

The client expects the API to expose these routes:

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Authenticate with `{ username, password }` and receive `{ token }` |
| `POST` | `/api/payments` | Create a payment |
| `GET` | `/api/payments` | Retrieve all payment records |
| `GET` | `/api/payments/{id}` | Retrieve one payment by GUID |
| `PUT` | `/api/payments/{id}` | Update a payment using `{ status, reason }` |
| `POST` | `/api/payments/{id}/complete` | Complete a payment |
| `POST` | `/api/payments/{id}/fail` | Fail a payment using `{ reason }` |
| `DELETE` | `/api/payments/{id}` | Cancel a payment through the backend soft-delete workflow |

Payment creation uses the following contract:

```json
{
	"correlationId": "guid",
	"amount": 125.5,
	"currency": "USD",
	"accountId": "guid"
}
```

Supported currencies are `USD`, `EUR`, and `COP`. Payment details include `id`, `correlationId`, `amount`, `currency`, `accountId`, `status`, `createdAt`, `updatedAt`, and `failureReason`.

## Project structure

All application source is contained under `src/app` and grouped by responsibility:

```text
src/app/
├── core/
│   ├── guards/auth.guard.ts
│   ├── interceptors/auth.interceptor.ts
│   └── services/auth.service.ts
├── features/
│   ├── auth/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.css
│   └── payments/
│       ├── components/
│       │   ├── payment-list.component.*
│       │   └── payment-form.component.*
│       ├── models/payment.model.ts
│       └── services/payment.service.ts
├── app.config.ts
├── app.routes.ts
└── app.component.ts
```

## Security and error handling

After login, the JWT is stored in browser `localStorage` under `payment_access_token`. The functional interceptor adds it as a Bearer token to outgoing requests. The functional route guard redirects unauthenticated users to `/login`.

The interceptor and authentication service translate a backend RFC 7807 `ProblemDetails.detail` value into a standard JavaScript `Error`, allowing login, loading, creation, and payment action failures to display a useful message without exposing response internals.

For production deployment, use HTTPS, configure a production API origin, review token storage requirements, and configure the API's CORS policy for the deployed frontend origin.

## Troubleshooting

**`Http failure response ...: 0 Unknown Error`**

Confirm that the backend is running at `http://localhost:5080`, the frontend was started with `npm start`, and the development server was restarted after proxy changes.

**The ledger shows only five records**

The client displays five rows per page by default. Use the rows selector and next-page control below the grid. Pagination is client-side because the current Swagger contract returns an array and does not define server-side paging parameters.

**A second payment is rejected as a duplicate**

Each successful creation generates a fresh correlation ID before the next form submission. If a duplicate error persists, verify that the backend idempotency store is available and that the request contains a new `correlationId`.