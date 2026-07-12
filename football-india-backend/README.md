# Football India Backend

NestJS + Supabase backend for the Indian Football Community platform. All routes are prefixed with `/api`.

## Setup

1. Create a Supabase project and set `DATABASE_URL` to its session-pooler connection string (recommended for IPv4 environments). Run `npm run db:migrate`; migrations are versioned and safe to rerun.
2. Copy `.env.example` to `.env` and provide the Supabase and Razorpay credentials.
3. Run `npm install`, then `npm run dev`.

For production, set `NODE_ENV=production`, `FRONTEND_URL` to the exact allowed origin(s), and `PAYMENTS_ENABLED=true` only after setting all Razorpay credentials including `RAZORPAY_WEBHOOK_SECRET`. Configure the Razorpay webhook URL as `https://<api-host>/api/payments/webhook` for `payment.captured` events.

Supabase Auth issues the access and refresh JWTs. Registration is currently configured for simple entry: users are created as confirmed and signed in immediately. Send authenticated requests with `Authorization: Bearer <access_token>`. To grant admin access, set `app_metadata.role` to `admin` using the Supabase admin API/dashboard; clients cannot self-assign this role.

## API groups

- `POST /api/auth/register|login|refresh|forgot-password|reset-password|logout`
- Public reads and admin writes: `/api/clubs`, `/api/players`, `/api/national-teams`
- Public: `GET /api/leaderboard`, `GET /api/leaderboard/compare?ids=...`
- Blogs: public published reads; authenticated author create/update/delete; `/api/comments`; `/api/likes/:blogId`
- Store: public `/api/store/products` and `/api/store/categories`; admin product/category writes
- Authenticated `/api/cart`, `/api/orders`, `/api/payments`, and `/api/notifications`
- Admin-only `/api/admin/dashboard`, `/api/admin/users`, and `/api/admin/blogs`

Order totals and stock are calculated inside `create_order_from_cart`; submitted client prices are never used. Razorpay signatures are verified before `mark_order_paid` confirms an order.

## Verification

```sh
npm run build
npm run test:e2e
npm audit --omit=dev
npm run db:migrate
```

The service exposes `GET /api/health` for deployment health checks. A multi-stage non-root `Dockerfile`, `render.yaml`, and GitHub Actions verification workflow are included.

## Frontend

The web frontend lives in `../football-india-test-frontend`. Start this backend on port 3000, then run `npm install` and `npm run dev` from that directory. Open `http://localhost:5173`.
