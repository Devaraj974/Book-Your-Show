# 🎬 Book Your Show - Movie Ticket Booking System

**Book Your Show** is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to provide a seamless movie ticket booking experience. It features a modern UI, interactive seat selection, secure payment integration, and automated email notifications.

---

## 🌟 Key Features

-   **User Authentication**: Secure login and registration using JWT and Bcrypt.
-   **Dynamic Movie Catalog**: Real-time movie listings fetched from a MongoDB database (with optional TMDB API sync).
-   **Interactive Seat Selection**: A visual theater layout where users can pick specific seats.
-   **Secure Payments**: Integrated with **Razorpay** for a safe and reliable checkout experience.
-   **Automated Ticketing**: Users receive a confirmation email with a **QR-coded PDF ticket** via Nodemailer.
-   **Admin Dashboard**: Dedicated portal for administrators to manage movies, theaters, shows, and view user bookings.
-   **Responsive Design**: Fully styled with **Tailwind CSS** for a premium look on all devices.

---

## 🛠️ Tech Stack

-   **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Zustand (State Management).
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB (Mongoose ODM).
-   **External APIs**: Razorpay (Payments), Nodemailer (Emails), TMDB API (Movie Data).

---

## 🚀 Getting Started

### Prerequisites

-   Node.js installed on your machine.
-   MongoDB account (Atlas or local installation).
-   Razorpay Account (for API keys).

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd movie-booking-system
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add the variables as shown in `.env.example`.
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder and add your Razorpay key as shown in `.env.example`.
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Business logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & error handling
│   └── utils/           # Email & Payment helpers
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Main application views
│   │   ├── services/    # API calls (Axios)
│   │   └── store/       # Zustand state management
│   └── public/          # Static assets
└── README.md
```

---

## 📄 Documentation

-   For detailed code explanation, refer to [Code_Explanation_Script.md](./artifacts/Code_Explanation_Script.md).
-   For future deployment steps, refer to [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

This project is licensed under the MIT License.
