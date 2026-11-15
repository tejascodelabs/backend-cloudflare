# Node.js / Express backend setup

## 1. Expected structure

```text
project/
├── index.js
├── package.json
├── .env
└── src/
    ├── app.js
    ├── config/
    │   ├── index.js
    │   └── logger.js
    ├── middleware/
    │   ├── cors.middleware.js
    │   ├── req.middleware.js
    │   └── error.middleware.js
    └── utils/
        └── error.js
```

## 2. Required package.json settings

Ensure `package.json` includes `"type": "module"` and a start script. Example:

```json
{
    "type": "module",
    "scripts": {
        "start": "node index.js",
        "dev": "node --watch index.js"
    }
}
```

Install dependencies if missing:

```bash
npm install express cookie-parser helmet cors winston dotenv
```

Use your existing `package.json` and merge the `"type"` and scripts instead of overwriting your dependencies.

## 3. Configure environment

Copy `.env.example` to `.env`, then set `ALLOWED_ORIGINS` to the exact frontend origin(s). Keep origins comma-separated and do not add trailing slashes.

## 4. Run and verify

```bash
npm run dev
```

Check:

- `GET http://localhost:4001/`
- `GET http://localhost:4001/api/health`

If deployed behind a hosting platform, the server binds to `0.0.0.0` and uses the platform's `PORT`.

## 5. CORS troubleshooting

Set the frontend's exact origin in `ALLOWED_ORIGINS`, e.g. `https://tejasderle.dev`. If the request is from a preview domain, include that exact preview origin too. Restart/redeploy after changing environment variables.

Add application route files in `src/app.js` before the 404 handler. The provided files do not include database connection code or application-specific routes.

Your Docker Compose configuration is mostly correct. Here's a cleaned-up, ready-to-use version with port mapping, healthcheck, and persistent storage.

## 1. Fixed `docker-compose.yml`

yaml

```yaml
services:
    postgres:
        image: postgres:16-alpine
        container_name: postgres-db
        restart: unless-stopped

        environment:
            POSTGRES_DB: appdb
            POSTGRES_USER: appuser
            POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?Set POSTGRES_PASSWORD in .env}

        ports:
            - "5432:5432"

        volumes:
            - postgres_data:/var/lib/postgresql/data

        healthcheck:
            test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
            interval: 5s
            timeout: 3s
            retries: 20
            start_period: 10s

volumes:
    postgres_data:
```

## 2. Create `.env`

In the same directory as `docker-compose.yml`:

bash

```bash

POSTGRES_PASSWORD=MySecurePassword123
```

Don't commit `.env` to Git. Add it to `.gitignore`:

gitignore

```gitignore
.env
```

## 3. Start PostgreSQL

bash

```bash
docker compose up -d
```

Check status:

bash

```bash
docker compose ps
```

Check logs:

bash

```bash
docker compose logs -f postgres
```

## 4. Connect to PostgreSQL

bash

```bash
docker exec -it postgres-db psql -U appuser -d appdb
```

Connection details:

| Property | Value             |
| -------- | ----------------- |
| Host     | localhost         |
| Port     | 5432              |
| Database | appdb             |
| Username | appuser           |
| Password | Value from `.env` |

Connection URL:

env

```env
DATABASE_URL=postgresql://appuser:MySecurePassword123@localhost:5432/appdb
```

## 5. Important notes

- `postgres_data` ensures database persistence.
- `healthcheck` checks whether PostgreSQL is ready.
- `restart: unless-stopped` automatically restarts the container.
- Port mapping allows host applications to connect to PostgreSQL.
- If another PostgreSQL instance uses port 5432, change the mapping to `"5433:5432"`.

One important detail: If you change `POSTGRES_PASSWORD` after the database has already been initialized, PostgreSQL will not automatically update the existing database user's password.
