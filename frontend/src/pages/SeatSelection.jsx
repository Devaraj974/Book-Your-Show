import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { ChevronLeft, Info, Loader2, ShieldCheck, Ticket, User, MapPin, Calendar, Clock } from 'lucide-react';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const userInfo = useAuthStore(state => state.userInfo);
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      toast.info('Please sign in to book your seats.');
      navigate('/login');
      return;
    }

    const fetchShow = async () => {
      try {
        const { data } = await api.get(`/shows/${showId}`);
        setShow(data);
      } catch (err) {
        toast.error('Failed to load show details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchShow();
  }, [showId, userInfo, navigate]);

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      if (selectedSeats.length >= 10) {
        toast.warning('Maximum 10 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const tiers = [
    { name: 'RECLINER', price: show ? show.price * 2 : 0, rows: ['N', 'M'] },
    { name: 'PRIME PLUS', price: show ? show.price * 1.5 : 0, rows: ['L', 'K', 'J'] },
    { name: 'PRIME', price: show ? show.price * 1.2 : 0, rows: ['H', 'G', 'F'] },
    { name: 'CLASSIC', price: show ? show.price : 0, rows: ['E', 'D', 'C', 'B', 'A'] }
  ];

  const calculatedTotal = selectedSeats.reduce((total, seatId) => {
    const row = seatId.charAt(0);
    const tier = tiers.find(t => t.rows.includes(row));
    return total + (tier ? tier.price : 0);
  }, 0);

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }
    
    // Update: Instead of booking directly, navigate to Payment
    navigate(`/payment/${showId}`, {
      state: {
        selectedSeats,
        totalAmount: calculatedTotal
      }
    });
  };

  if (loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-gray-400 font-medium">Loading layout...</p>
    </div>
  );

  // tiers already defined above
  
  const cols = Array.from({ length: 14 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-white -mx-4 -mt-8 animate-in fade-in duration-500 flex flex-col">
      {/* Header Bar - (Screenshot 4-like) */}
      <div className="bg-[#1f2533] text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-all"><ChevronLeft className="w-6 h-6" /></button>
             <div className="space-y-0.5">
               <h2 className="text-lg font-black tracking-tight">{show?.movieId.title}</h2>
               <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-2">
                 {show?.theaterId.name} | {new Date(show?.showTime).toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short' })}, {new Date(show?.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="border border-white/20 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3 text-primary" /> {selectedSeats.length || 0} Tickets
             </div>
          </div>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="flex-grow overflow-auto p-8 relative flex flex-col items-center">
        {/* Screen Indicator */}
        <div className="w-full max-w-4xl space-y-12 mb-20 text-center">
            <div className="w-[80%] h-1 bg-gray-100 mx-auto rounded-full shadow-[0_-5px_15px_rgba(0,0,0,0.1)] mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">All eyes this way</p>
        </div>

        {/* Dynamic Seat Grid */}
        <div className="space-y-12 w-full max-w-5xl">
           {tiers.map(tier => (
             <div key={tier.name} className="space-y-6">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#666666]">₹{tier.price} {tier.name}</span>
                </div>
                <div className="grid gap-3">
                   {tier.rows.map(row => (
                     <div key={row} className="flex gap-8 items-center justify-center">
                        <span className="w-4 text-[10px] font-black text-gray-300">{row}</span>
                        <div className="flex gap-2">
                           {cols.map(col => {
                             const seatId = `${row}${col}`;
                             const isBooked = !show.availableSeats.includes(seatId);
                             const isSelected = selectedSeats.includes(seatId);
                             
                             return (
                               <button
                                 key={seatId}
                                 disabled={isBooked}
                                 onClick={() => toggleSeat(seatId)}
                                 className={`
                                   w-7 h-7 border rounded-[4px] text-[10px] font-bold transition-all
                                   ${isBooked ? 'bg-[#eeeeee] border-gray-200 text-gray-400 cursor-not-allowed' : 
                                     isSelected ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20' : 
                                     'bg-white border-green-500 text-green-600 hover:bg-green-500 hover:text-white'}
                                 `}
                               >
                                 {col < 10 ? `0${col}` : col}
                               </button>
                             );
                           })}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           ))}
        </div>

        {/* Legend Bar at Bottom */}
        <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50">
           <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                 <div className="flex items-center gap-2"><div className="w-4 h-4 border border-gray-200 bg-white rounded-sm" /> Available</div>
                 <div className="flex items-center gap-2"><div className="w-4 h-4 bg-primary rounded-sm" /> Selected</div>
                 <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#eeeeee] border border-gray-200 rounded-sm" /> Sold</div>
              </div>

              {selectedSeats.length > 0 && (
                <button 
                  disabled={bookingLoading}
                  onClick={handleBooking}
                  className="w-full md:w-auto bg-primary text-white px-16 py-3 rounded-xl font-black uppercase text-sm tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                >
                  {bookingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>PROCEED TO PAYMENT — ₹{calculatedTotal}</>}
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
