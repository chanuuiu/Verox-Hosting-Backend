# Verox Hosting Backend

Node.js + Express backend for game server hosting platform.

## Setup

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/verox
JWT_SECRET=your_secret_key_here
PORT=5000
```

## Run

```bash
node server.js
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `POST /api/admin/users` - Create user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `PUT /api/admin/users/:id` - Update user (admin only)
