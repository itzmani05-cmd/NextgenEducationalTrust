# NextGen Solutions Educational Trust

Website and scholarship platform for NextGen Solutions Educational Trust — a public site (mission, C3 Educational Platform, events, donations) plus an authenticated scholarship application flow, applicant status tracking, and an admin portal for verification, payments, and analytics.

- **Live site:** https://www.nextgenedutrust.in
- **API:** https://nextgeneducationaltrust-tr7s.onrender.com

## Tech Stack

**Frontend** — React 18, Vite, React Router 7, Tailwind CSS, Supabase JS (auth), react-helmet-async (SEO)
**Backend** — Node.js, Express, Prisma ORM, PostgreSQL (Supabase), JWT auth, Multer (uploads), Supabase Storage (documents), Resend (email), pdf-lib / pdfkit (receipts)

## Project Structure

```
├── src/                      # Frontend (Vite root)
│   ├── pages/                 # Route-level pages (Dashboard, Apply, Scholarships, Events, ...)
│   │   └── admin/              # Admin portal pages
│   ├── components/            # UI components, grouped by page/feature
│   ├── context/                # Auth contexts (applicant + admin)
│   ├── hooks/, utils/, i18n/  # Hooks, helpers, English/Tamil translations
│   └── seo/                    # Site-wide SEO config + JSON-LD builders
├── public/                   # Static assets, robots.txt, sitemap.xml
├── server/                   # Backend API
│   ├── src/
│   │   ├── routes/             # applications, auth, donations
│   │   └── *.js                 # scholarship calc, PDF/receipt generation, email, audit log
│   └── prisma/                 # schema.prisma + migrations
└── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project (Postgres database + Storage bucket + Auth)

### 1. Frontend

```bash
npm install
```

Create a `.env` file in the project root:

```bash
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional — payment details shown on the /payment page.
# Leave blank to show a "contact the Trust office" fallback instead.
VITE_PAYMENT_UPI_ID=
VITE_PAYMENT_BANK_NAME=
VITE_PAYMENT_BANK_ACCOUNT_NAME=
VITE_PAYMENT_BANK_ACCOUNT_NUMBER=
VITE_PAYMENT_BANK_IFSC=
```

```bash
npm run dev       # start the Vite dev server
npm run build      # production build
npm run preview    # preview the production build locally
npm run lint       # ESLint
```

### 2. Backend

```bash
cd server
npm install
cp .env.example .env   # then fill in the values — see comments in the file
npx prisma generate
npx prisma migrate dev
npm run dev             # starts on PORT (default 4000)
```

Key backend scripts (from `server/`):

```bash
npm run dev              # nodemon-style dev server (node --watch)
npm run start             # production start
npm run prisma:generate   # regenerate the Prisma client
npm run prisma:migrate    # run migrations
npm run prisma:studio     # open Prisma Studio
```

`server/.env.example` documents every required variable (Supabase DB connection, `CORS_ORIGIN`, `JWT_SECRET`, `ADMIN_PASSWORD`, Supabase Storage service role key, Resend API key). `CORS_ORIGIN` must exactly match your frontend origin(s) — no trailing slash — as a comma-separated list.

## Deployment

- **Frontend:** Vercel (SPA rewrite in `vercel.json`)
- **Backend:** Render
- **Database & Storage:** Supabase
- **Transactional email:** Resend

## License

Private — all rights reserved by NextGen Solutions Educational Trust.
