<p align="center">
  <img src="public/apigo-icon.svg" alt="API Go! Icon" width="80" height="80" style="border-radius: 16px;"/>
</p>

<h1 align="center">API Go!</h1>
<p align="center">
  <strong>Open-source, cloud-synced API testing workspace</strong><br/>
  Built with Next.js 15 · Firebase Auth · PostgreSQL · Prisma · <a href="https://apigo.gracer.co.th" target="_blank">Demo</a>
</p>

<p align="center">
  <a href="https://github.com/iamapinan/APIGo/stargazers">
    <img src="https://img.shields.io/github/stars/iamapinan/APIGo?style=flat-square&color=6366f1" alt="Stars"/>
  </a>
  <a href="https://github.com/iamapinan/APIGo/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-emerald?style=flat-square" alt="License"/>
  </a>
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript"/>
</p>

<br/>

![API Go! Screenshot](public/Screenshot.png)

---

## What is API Go!?

**API Go!** is a self-hostable, open-source alternative to Postman and Insomnia. Your requests, collections, environments, and history are synced securely to a PostgreSQL database in the cloud — accessible from any browser, shareable with your team.

No desktop install. No expensive subscriptions. Just sign in with Google and start testing.

---

## Features

| Feature | Description |
|---|---|
| **Request Collections** | Organize requests into nested folders. Create, rename, and delete with inline editing. |
| **Cloud Sync** | All data syncs to Neon PostgreSQL via Prisma ORM, authenticated with Firebase. |
| **Collection Sharing** | Share individual collections with teammates using their email address. |
| **Multi-Environment** | Manage Dev, Staging, Production environments with full variable substitution in URLs, headers, and body. |
| **Environment Sharing** | Share environments with other users — great for team-wide config like base URLs. |
| **Secure Secrets** | Store API keys and tokens separately. Secrets are injected at request time. |
| **Global Headers** | Define headers once; they are injected into every outgoing request automatically. |
| **Request History** | Every sent request is logged. Delete individual entries or clear all history. |
| **Body Types** | Supports `none`, `raw` (JSON), `x-www-form-urlencoded`, and `form-data` body types. |
| **Response Viewer** | Colorized JSON syntax highlighting, response headers view, status badge, and timing info. |
| **Google Sign-In** | One-click login with Firebase Google Auth. No passwords to manage. |
| **Open Source** | MIT license. Self-host it, fork it, or contribute. |

---

## Tech Stack

- **Framework** — [Next.js 15](https://nextjs.org) (App Router, Server Components)
- **Language** — TypeScript 5
- **Database** — [Neon](https://neon.tech) serverless PostgreSQL
- **ORM** — [Prisma](https://prisma.io) v7
- **Authentication** — [Firebase](https://firebase.google.com) (Google Sign-In + Admin SDK for server-side token verification)
- **Styling** — Tailwind CSS v4
- **Icons** — [Lucide React](https://lucide.dev)

---

## Getting Started

### Prerequisites

- Node.js 20+ or [Bun](https://bun.sh)
- A [Firebase project](https://console.firebase.google.com) with Google Auth enabled
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)

### 1. Clone

```bash
git clone https://github.com/iamapinan/APIGo.git
cd APIGo
bun install
```

### 2. Configure environment variables

Create `.env` and `.env.local` files:

```bash
# .env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 3. Push database schema

```bash
bunx prisma generate
bunx prisma db push
```

### 4. Run development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Schema

```
User
  ├── CollectionItem (folder/request, self-referencing hierarchy)
  │     └── CollectionShare (shared by email)
  ├── HistoryItem
  ├── Environment
  │     └── EnvironmentShare (shared by email)
  ├── Secret
  └── GlobalHeader
```

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET/POST | `/api/collections` | List / create collection items |
| PUT/DELETE | `/api/collections/[id]` | Update / delete a collection item |
| POST | `/api/collections/share` | Share collection with a user by email |
| GET/POST/DELETE | `/api/history` | List / add / clear all history |
| DELETE | `/api/history/[id]` | Delete individual history entry |
| GET/POST | `/api/environments` | List / create environments |
| PUT/DELETE | `/api/environments/[id]` | Update / delete environment |
| POST | `/api/environments/share` | Share environment with a user |
| GET/PUT | `/api/secrets` | Get / replace all secrets |
| GET/PUT | `/api/global-headers` | Get / replace all global headers |

All routes require a Firebase ID token in the `Authorization: Bearer <token>` header.

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes
4. Open a Pull Request

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.

---

<p align="center">Made with care by <a href="https://github.com/iamapinan">@iamapinan</a></p>
