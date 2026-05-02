import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MovieDetails from './pages/MovieDetails'
import SeatSelection from './pages/SeatSelection'
import Payment from './pages/Payment'
import BookingSuccess from './pages/BookingSuccess'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import useAuthStore from './store/authStore'

function App() {
  const userInfo = useAuthStore(state => state.userInfo);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-dark selection:bg-primary selection:text-white font-['Roboto',sans-serif]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!userInfo ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!userInfo ? <Register /> : <Navigate to="/" />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/book/:showId" element={<SeatSelection />} />
          <Route path="/payment/:showId" element={userInfo ? <Payment /> : <Navigate to="/login" />} />
          <Route path="/success/:bookingId" element={userInfo ? <BookingSuccess /> : <Navigate to="/login" />} />
          <Route path="/profile" element={userInfo ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/admin" element={userInfo?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <ToastContainer position="bottom-right" theme="dark" newestOnTop />
      <footer className="py-16 bg-secondary border-t border-white/5 mt-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 text-center space-y-6 relative z-10">
           <div className="flex items-center justify-center gap-2 group transition-all duration-700">
             <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tighter text-white">BOOK</span>
                <span className="bg-primary text-white px-2 py-0.5 rounded-md text-xl font-black italic shadow-lg shadow-primary/20">YOUR</span>
                <span className="text-2xl font-black tracking-tighter text-white">SHOW</span>
             </div>
           </div>
           <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Experience Cinema Like Never Before</p>
           <div className="flex justify-center gap-8 text-white/40 text-xs font-bold uppercase tracking-widest pt-4">
              <a href="#" className="hover:text-primary transition-colors">Movies</a>
              <a href="#" className="hover:text-primary transition-colors">Shows</a>
              <a href="#" className="hover:text-primary transition-colors">Events</a>
              <a href="#" className="hover:text-primary transition-colors">Corporate</a>
           </div>
           <p className="text-gray-500 text-xs font-medium pt-4">
             &copy; {new Date().getFullYear()} Book Your Show. All rights reserved.
           </p>
        </div>
      </footer>
    </div>
  )
}

export default App
