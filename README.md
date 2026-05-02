<div align="center">

# 🎬 Book Your Show

### A full-stack MERN movie ticket booking platform with real-time seat selection, secure payments, and automated QR-coded ticketing.

[![Demo Video](https://img.shields.io/badge/▶%20Demo-Watch%20Now-FF0000?style=for-the-badge&logo=google-drive&logoColor=white)](https://drive.google.com/file/d/1QclgQJHiAprIGe0fTSEt3EJ26rSXo3cP/view?usp=sharing)
[![Code Explanation](https://img.shields.io/badge/📄%20Code-Explanation-4285F4?style=for-the-badge&logo=google-drive&logoColor=white)](https://drive.google.com/file/d/1uHCWYjCx-s7PGKRB5Mc-hKI5uzzhe4_H/view?usp=sharing)

[Features](#-features) · [Tech Stack](#️-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Contributing](#-contributing)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **User Authentication** | Secure login & registration with JWT & Bcrypt |
| 🎥 **Dynamic Movie Catalog** | Real-time listings synced with the TMDB API |
| 💺 **Interactive Seat Selection** | Visual theater layout with live seat availability |
| 💳 **Secure Payments** | Razorpay integration for safe, reliable checkout |
| 📧 **Automated Ticketing** | Email confirmation with a QR-coded PDF ticket via Nodemailer |
| 🛠️ **Admin Dashboard** | Manage movies, theaters, shows, and bookings |
| 📱 **Responsive Design** | Polished UI across all screen sizes with Tailwind CSS |

---

## 🛠️ Tech Stack

**Frontend**
- ⚛️ React 19 + Vite
- 🎨 Tailwind CSS
- 🐻 Zustand (State Management)
- 🔷 Lucide Icons

**Backend**
- 🟢 Node.js + Express.js
- 🍃 MongoDB + Mongoose ODM

**Integrations**
- 💸 Razorpay — Payment processing
- 📬 Nodemailer — Transactional emails
- 🎬 TMDB API — Movie data

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/atlas) (Atlas or local)
- [Razorpay](https://razorpay.com/) account (for API keys)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/book-your-show.git
cd book-your-show
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory based on `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
TMDB_API_KEY=your_tmdb_api_key
```

Then start the development server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_API_BASE_URL=http://localhost:5000/api
```

Then start the dev server:

```bash
npm run dev
```

The app will be running at `http://localhost:5173` 🎉

---

## 📁 Project Structure

```
book-your-show/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route business logic
│   ├── middleware/      # Auth & error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoint definitions
│   └── utils/           # Email & payment helpers
│
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Application views / routes
│       ├── services/    # Axios API calls
│       └── store/       # Zustand state management
│
└── README.md
```

---

## 🎥 Demo & Documentation

- 📄 **Code Explanation** — See [`artifacts/Code_Explanation.md`](./artifacts/Code_Explanation.md) for a detailed walkthrough of the codebase.
- 🚢 **Deployment Guide** — See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for production deployment steps.

---

## 🤝 Contributing

Contributions are welcome and appreciated!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Made with ❤️ and ☕ — happy booking!

</div>
