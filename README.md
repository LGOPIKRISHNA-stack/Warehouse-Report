# Warehouse Work Report Website

A full-stack warehouse daily-report system with:
- Admin and employee login
- Employee-specific data visibility
- Admin add/update daily scanned, billed, E-Way bill and mask-adding counts
- MongoDB persistence
- JWT authentication and hashed passwords
- Socket.IO real-time synchronization: employee dashboards refresh when admin changes data

## Run locally
1. Install Node.js 20+ and MongoDB.
2. Copy `.env.example` to `.env` and change `JWT_SECRET`.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:5000`.

Default admin comes from `.env`:
`admin@warehouse.local` / `Admin@12345`

Create employee accounts from the database initially, or extend the admin UI with an employee-management form. The API already supports `POST /api/employees` for that purpose.
