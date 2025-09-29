# Health/Medical Website (Node + MySQL + Vanilla JS)

A simple, secure starter for a health/medical site with:
- User auth (register/login with JWT)
- Public health articles
- Appointment booking
- MySQL database

## Tech
- Frontend: HTML/CSS/JS (vanilla)
- Backend: Node.js + Express
- DB: MySQL (mysql2)

## Quick Start
1. Install Node.js (18+), MySQL (8+).
2. Create database and tables:
   ```sql
   -- in MySQL shell or GUI
   SOURCE ./sql/schema.sql;
   ```
3. Copy `.env.example` to `.env` and set values.
4. Install deps: `npm install`
5. Run: `npm run dev`
6. Open: `http://localhost:3000`

## Default Roles
- `patient` (default on signup)
- `doctor` (manually change role in DB or via admin tooling later)
- `admin` (manually set in DB)

## Security Notes
- Use HTTPS in production.
- Change `JWT_SECRET`, set strong DB creds.
- Configure CORS to allowed origins in production.

## Folder Structure
```
health-med-site/
  public/            # frontend (static)
  src/
    routes/          # API routes
    middleware/      # auth middleware
    config/          # DB pool
  sql/               # schema
```

## API (brief)
- `POST /api/auth/register {name,email,password}`
- `POST /api/auth/login {email,password}`
- `GET /api/articles` (public)
- `POST /api/articles` (doctor/admin)
- `GET /api/appointments` (auth)
- `POST /api/appointments {date,time,reason}` (auth)

## Making a doctor/admin
After a user signs up, set role:
```sql
UPDATE users SET role = 'doctor' WHERE email = 'doctor@example.com';
-- or 'admin'
```
