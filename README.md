# SimpleWebMessaging
A full-stack real-time web messaging app. Users can register, log in, search for other users, and send messages in one-on-one chats.

<img width="2868" height="1528" alt="image" src="https://github.com/user-attachments/assets/55b5690c-b849-403f-994d-304a1d4b1538" />



<img width="568" height="1258" alt="image" src="https://github.com/user-attachments/assets/413f2caf-8e65-4d3a-b567-c4254da8311a" />




## Tech Stack
  
**Frontend** — React, TypeScript, Vite, Tailwind CSS, React Router · deployed on [Netlify](https://simplewebmessaging.netlify.app)

**Backend** — Node.js, Express, Prisma ORM, PostgreSQL, JWT auth · deployed on Railway

## Project Structure

```
/
├── frontend/   # React SPA
└── backend/    # Express REST API
```

## Features

- JWT authentication with silent token refresh via httpOnly cookie
- Register, log in, and edit your profile (name, email)
- Search users and start one-on-one chats
- Access tokens stored in React state only — never in `localStorage`

## API Overview

### Auth
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/users/login` | Login — returns access token, sets refresh cookie |
| `GET` | `/refresh` | Exchange refresh cookie for a new access token |
| `GET` | `/logout` | Clear refresh cookie and invalidate token |

### Users
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/users` | Register |
| `GET` | `/users` | List all users |
| `GET` | `/users/me` | Get current user |
| `POST` | `/users/update/firstname` | Update first name |
| `POST` | `/users/update/lastname` | Update last name |
| `POST` | `/users/update/email` | Update email |

### Chats & Messages
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/chats` | Create a chat between two users (or return existing) |
| `POST` | `/messages` | Send a message in a chat |

## Authentication Flow
  <img width="2884" height="1518" alt="image" src="https://github.com/user-attachments/assets/a8b8e93a-a2f8-4d93-9a21-db2a455b6d60" />
1. Login returns a short-lived access token (15 min) in the response body and sets a long-lived refresh token (2 days) as an httpOnly cookie.
2. The refresh token is stored in the database.
3. On app load, the frontend silently calls `GET /refresh` to restore the session without a login prompt.
4. All protected requests use the access token as a `Bearer` header. A `401` triggers one automatic retry with a fresh token.
5. Logout clears the cookie and removes the token from the database.

## Local Development

### Backend

```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npm start              # runs prisma migrate deploy, then starts the server
```

Required env vars:
```
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/dbname
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
NODE_ENV=development
```

### Frontend

```bash
cd frontend
cp .env.example .env   # set VITE_BACKEND to your backend URL
npm install
npm run dev
```

Required env var:
```
VITE_BACKEND=http://localhost:3000
```

## Deployment

**Backend** is deployed on Railway. The start script runs `prisma migrate deploy` automatically before the server starts, so migrations apply on each deploy.

**Frontend** is deployed on Netlify. The `frontend/netlify.toml` sets the build command, publish directory (`dist`), and a catch-all redirect to `index.html` so React Router handles client-side routing. Set `VITE_BACKEND` as a Netlify environment variable pointing to your Railway backend URL.

Update `backend/config/allowedOrigins.js` with your Netlify URL to allow CORS from the frontend.
