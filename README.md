# Rockwell Home Management API

NestJS + PostgreSQL backend for the Rockwell Digital Shield platform.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/docs` | Swagger documentation |
| GET | `/api/v1/homes?orgId=` | List properties |
| GET | `/api/v1/homes/:id` | Property detail |
| POST | `/api/v1/homes` | Create property |
| PUT | `/api/v1/homes/:id` | Update property |
| GET | `/api/v1/homes/:id/members` | List property members |
| GET | `/api/v1/homes/:id/residents` | List residents |
| GET | `/api/v1/alerts` | Open alerts |
| GET | `/api/v1/alerts?homeId=` | Alerts by property |
| POST | `/api/v1/alerts` | Create alert |
| PUT | `/api/v1/alerts/:id/acknowledge` | Acknowledge alert |
| PUT | `/api/v1/alerts/:id/resolve` | Resolve alert |
| GET | `/api/v1/notes?homeId=` | Notes by property |
| POST | `/api/v1/notes` | Create note |
| GET | `/api/v1/visits` | Recent visit reports |
| GET | `/api/v1/visits?homeId=` | Visits by property |
| POST | `/api/v1/visits` | Submit visit report |
| GET | `/api/v1/devices` | All devices |
| GET | `/api/v1/devices?homeId=` | Devices by property |
| PUT | `/api/v1/devices/:id/status` | Update device status |

## Deploy to Railway

### Step 1: Create GitHub Repository
```bash
cd rockwell-api
git init
git add .
git commit -m "Initial commit: Rockwell API scaffold"
git remote add origin https://github.com/YOUR_USERNAME/rockwell-api.git
git push -u origin main
```

### Step 2: Set Up Railway
1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"** → choose `rockwell-api`
4. Railway auto-detects the Dockerfile

### Step 3: Add PostgreSQL
1. In your Railway project, click **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway auto-creates `DATABASE_URL` and connects it to your app

### Step 4: Environment Variables
Railway sets `DATABASE_URL` automatically. Add:
- `NODE_ENV` = `production`
- `PORT` = `3000`

### Step 5: Custom Domain (Optional)
1. In Railway settings → **Networking** → **Custom Domain**
2. Add `api.rockwellhomemanagement.com`
3. Add CNAME record in Squarespace DNS

### Step 6: Seed Data
After first deploy, run in Railway terminal:
```bash
npx ts-node src/seeds/seed.ts
```

## Local Development
```bash
npm install
# Set DATABASE_URL in .env
npm run start:dev
```

API docs at http://localhost:3000/api/docs
