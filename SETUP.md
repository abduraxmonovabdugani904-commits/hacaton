# Hacathon Health App - Setup Guide

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Hacathon
```

### 2. Install Dependencies
```bash
npm install
```

This will automatically install dependencies for:
- Root (Frontend with React + Vite)
- Backend (Node.js + Express)

### 3. Configure Environment Variables

#### For Frontend
No additional configuration needed, uses `VITE_API_URL` from root `.env`

#### For Backend
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials and other settings.

## Running the Application

### Option 1: Frontend Only (Development)
```bash
npm run dev
```
Visit: `http://localhost:5173`

### Option 2: Backend Only
```bash
npm run dev:backend
```
Backend runs on: `http://localhost:3001`

### Option 3: Both Frontend & Backend (Recommended)
```bash
npm run dev:all
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Project Structure

```
Hacathon/
├── src/                    # Frontend React components
├── backend/                # Node.js Express server
├── frontend/               # Optional separate frontend (not in use)
├── public/                 # Static assets
├── package.json            # Root package.json (Frontend deps)
└── backend/package.json    # Backend dependencies
```

## Troubleshooting

### `npm install` fails
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules/` and `package-lock.json`
- Run `npm install` again

### Port already in use
- Frontend port 5173
- Backend port 3001
- Change ports in `vite.config.js` or `backend/server.js`

### Database connection error
- Verify PostgreSQL/SQLite is running
- Check `.env` database credentials
- Ensure database exists

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run dev:backend` | Start backend server |
| `npm run dev:all` | Start both frontend and backend |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run linter (oxlint) |
| `npm run install:all` | Reinstall all dependencies |

## Contributing

1. Create a feature branch
2. Make changes
3. Test locally
4. Commit and push
5. Create a pull request

## Support

For issues or questions, please create an issue in the repository.
