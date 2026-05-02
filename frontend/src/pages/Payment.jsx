import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { ChevronLeft, CreditCard, ShieldCheck, Info, Loader2, ArrowRight, Lock } from 'lucide-react';

const Payment = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useAuthStore(state => state.userInfo);
  const { selectedSeats, totalAmount } = location.state || { selectedSeats: [], totalAmount: 0 };
  
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(null);

  useEffect(() => {
    if (!location.state || !selectedSeats.length) {
      toast.info('Session expired or seats not selected. Redirecting...');
      navigate(`/book/${showId}`);
      return;
    }
    const fetchShow = async () => {
      try {
        const { data } = await api.get(`/shows/${showId}`);
        setShow(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchShow();
  }, [showId, selectedSeats, navigate]);

  // Load Razorpay Script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    const finalAmount = totalAmount + (selectedSeats.length * 28);

    try {
      // 1. Load Razorpay Script
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      // 2. Create Order on Backend
      const { data: order } = await api.post('/payments/order', {
        amount: finalAmount
      });

      // 3. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Si2VoI8TMaEsTH', // Updated fallback to match current new keys
        amount: order.amount,
        currency: order.currency,
        name: "MovieBooking App",
        description: `Booking for ${show.movieId.title}`,
        order_id: order.id,
        handler: async function (response) {
          // This executes when payment is successful
          try {
            // 4. Verify Payment on Backend
            const { data: verifyData } = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.message === "Payment verified successfully") {
              // 5. Create Final Booking
              const { data: bookingData } = await api.post('/bookings', {
                showId,
                seats: selectedSeats,
                totalAmount: finalAmount,
                paymentStatus: 'Confirmed'
              });

              toast.success('Payment Successful! Ticket Confirmed.');
              navigate(`/success/${bookingData._id}`);
            }
          } catch (err) {
            console.error('Verification failed:', err);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: userInfo?.name,
          email: userInfo?.email,
        },
        theme: {
          color: "#f84464",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error('Payment initialization failed:', err);
      toast.error(err.response?.data?.message || 'Failed to initialize payment.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return <div className="h-96 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-8">
         <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-all"><ChevronLeft className="w-6 h-6" /></button>
         <h1 className="text-3xl font-black tracking-tighter">ORDER <span className="text-primary italic">SUMMARY</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-700 flex items-center gap-2 uppercase tracking-widest text-xs"><CreditCard className="w-4 h-4 text-primary" /> Payment Options</h3>
                <span className="text-[10px] font-bold text-green-600 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Secure Connection</span>
             </div>
             
             <div className="p-8 text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 scale-125">
                   <ShieldCheck className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-black text-secondary">Razorpay Secure Checkout</h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">Click the button below to open the secure Razorpay payment gateway and complete your booking.</p>
                
                <div className="flex justify-center gap-4 pt-4 grayscale opacity-50">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="paypal" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="mastercard" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="visa" />
                </div>
             </div>
          </section>

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
             <Info className="w-5 h-5 text-blue-500 shrink-0" />
             <p className="text-[10px] text-blue-700 font-medium leading-relaxed uppercase tracking-wider">By clicking "Make Payment", you will be redirected to Razorpay to complete your transaction securely.</p>
          </div>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
             <div className="p-6 bg-secondary text-white space-y-1">
                <h3 className="text-xl font-bold tracking-tight">{show.movieId.title}</h3>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{show.theaterId.name}</p>
             </div>
             
             <div className="p-6 space-y-6">
                <div className="space-y-4 pb-4 border-b border-gray-100">
                   <div className="justify-between flex text-sm">
                      <span className="text-gray-500 font-medium uppercase text-xs">Tickets ({selectedSeats.length})</span>
                      <span className="font-bold text-gray-800">₹{totalAmount}.00</span>
                   </div>
                   <div className="justify-between flex text-sm">
                      <span className="text-gray-500 font-medium uppercase text-xs">Convenience Fees</span>
                      <span className="font-bold text-gray-800">₹{selectedSeats.length * 28}.00</span>
                   </div>
                </div>

                <div className="flex justify-between items-center bg-green-50 p-4 rounded-xl border border-green-100 mt-4">
                    <div className="space-y-0.5">
                       <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">Amount Payable</p>
                       <p className="text-2xl font-black text-gray-800">₹{totalAmount + (selectedSeats.length * 28)}.00</p>
                    </div>
                </div>

                <button 
                   disabled={loading}
                   onClick={handlePayment}
                   className="w-full bg-primary text-white py-4 rounded-xl flex items-center justify-center gap-3 font-black uppercase text-sm tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 mt-4"
                >
                   {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-4 h-4" /> Pay with Razorpay</>}
                </button>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Payment;
