import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Ticket, Calendar, MapPin, Clock, CreditCard, ChevronRight, History, Package, ShieldCheck, User } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Profile = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = useAuthStore(state => state.userInfo);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings/my-bookings');
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (!userInfo) return null;

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Profile Header */}
      <section className="glass p-12 rounded-[3.5rem] relative overflow-hidden flex flex-col md:flex-row items-center gap-10 shadow-2xl border-white/5">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-red-800 p-1 shrink-0 shadow-2xl relative z-10 ring-4 ring-white/10">
           <div className="w-full h-full rounded-full bg-dark flex items-center justify-center">
             <User className="w-16 h-16 text-primary" />
           </div>
        </div>
        <div className="space-y-3 relative z-10 text-center md:text-left">
           <div className="flex items-center justify-center md:justify-start gap-4">
             <h1 className="text-5xl font-black tracking-tighter">{userInfo.name}</h1>
             <span className="px-4 py-1 bg-primary/10 border border-primary/30 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">Platinum Member</span>
           </div>
           <p className="text-gray-500 font-medium text-lg flex items-center justify-center md:justify-start gap-2 italic">
             {userInfo.email} • Joined {new Date().toLocaleDateString([], { month: 'long', year: 'numeric' })}
           </p>
        </div>
      </section>

      {/* Booking History */}
      <section className="space-y-10 py-4">
        <div className="flex justify-between items-end border-b border-white/5 pb-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black flex items-center gap-4">
              <History className="text-primary w-8 h-8" /> Booking <span className="text-primary italic">History</span>
            </h2>
            <p className="text-gray-500 text-lg font-medium">Keep track of your cinematic experiences and upcoming shows.</p>
          </div>
          <div className="bg-white/5 px-6 py-3 rounded-2xl flex items-center gap-4 border border-white/10">
              <Package className="text-primary w-5 h-5" />
              <span className="text-sm font-black uppercase tracking-widest">Total: {bookings.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-48 glass rounded-[2rem] w-full animate-pulse bg-white/5" />
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid gap-8">
            {bookings.map((booking) => (
              <div key={booking._id} className="group glass p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 hover:border-primary/20 transition-all duration-500 shadow-xl relative overflow-hidden">
                {/* Decorative background number */}
                <span className="absolute -bottom-10 -right-6 text-[10rem] font-black text-white/5 italic select-none group-hover:text-primary/10 transition-colors">
                  {booking.seats.length}
                </span>

                <div className="w-full md:w-48 aspect-[2/3] rounded-2xl overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-700">
                  <img src={booking.showId?.movieId?.posterUrl || 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=500'} className="w-full h-full object-cover" alt="Poster" />
                </div>
                <div className="flex-grow space-y-6 relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black group-hover:text-primary transition-colors leading-tight">{booking.showId?.movieId?.title || 'Unknown Movie'}</h3>
                    <div className="flex flex-wrap items-center gap-6 text-gray-500 font-bold uppercase tracking-widest text-xs">
                       <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {booking.showId?.theaterId?.name || 'Unknown Theater'}</span>
                       <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {booking.showId ? new Date(booking.showId.showTime).toLocaleDateString() : 'N/A'}</span>
                       <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {booking.showId ? new Date(booking.showId.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2 border-t border-white/5 mt-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black text-gray-600 tracking-widest">Seats</p>
                      <p className="text-xl font-black text-white">{booking.seats.join(', ')}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black text-gray-600 tracking-widest">Total Paid</p>
                      <p className="text-xl font-black text-primary">₹{booking.totalAmount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black text-gray-600 tracking-widest">Status</p>
                      <p className="text-xs w-fit bg-green-500/10 text-green-500 py-1 px-4 rounded-full font-black uppercase tracking-widest border border-green-500/30 flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3" /> {booking.paymentStatus}
                      </p>
                    </div>
                    <div className="flex items-end lg:justify-end">
                      <Link to={`/success/${booking._id}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all group/btn">
                        View Ticket <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass p-24 rounded-[3rem] text-center space-y-6 opacity-60">
             <Ticket className="w-16 h-16 mx-auto text-primary opacity-50" />
             <div className="space-y-2">
               <p className="text-2xl font-light italic">The curtain hasn't risen yet.</p>
               <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Your future bookings will appear here.</p>
             </div>
             <Link to="/" className="btn-primary inline-flex px-8 rounded-full py-3">Browse Shows</Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
