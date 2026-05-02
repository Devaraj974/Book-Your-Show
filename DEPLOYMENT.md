# Deployment Guide

This guide outlines the changes needed when moving from a local development environment to a live production server (e.g., Vercel, Render, AWS, etc.).

## 1. Environment Variables
Ensure all variables in `.env.example` are set on your hosting platform's dashboard. Never push `.env` files to GitHub.

## 2. Frontend Configuration
### API URL
Currently, the frontend uses a Vite proxy in `vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://127.0.0.1:5000',
    changeOrigin: true,
  },
}
```
**In Production**:
- You should remove the proxy and set a `VITE_API_URL` environment variable.
- Update `frontend/src/services/api.js` to use this variable:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});
```

### Razorpay Key
The `VITE_RAZORPAY_KEY_ID` in `frontend/.env` must be swapped from a **test** key to a **live** key when you are ready to accept real payments.

## 3. Backend Configuration
### CORS
Update `backend/server.js` to only allow requests from your production frontend URL:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

### Database
Update `MONGO_URI` to point to a production database like **MongoDB Atlas** instead of `localhost`.

## 4. Build Commands
- **Frontend**: Run `npm run build` to generate the production-ready `dist` folder.
- **Backend**: Ensure your start script in `package.json` is `node server.js` (not nodemon).
