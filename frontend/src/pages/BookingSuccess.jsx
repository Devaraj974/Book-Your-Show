import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { QRCodeCanvas } from 'qrcode.react';
import { Receipt, CheckCircle, Ticket, MapPin, Calendar, Clock, Download, Share2, Loader2, User, Film, ChevronLeft, ArrowRight } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

const BookingSuccess = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const ticketRef = useRef();

  const location = useLocation();
  const mockBooking = location.state?.mockBooking;

  useEffect(() => {
    if (mockBooking) {
      setBooking(mockBooking);
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const { data } = await api.get(`/bookings/${bookingId}`);
        setBooking(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId, mockBooking]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const movieTitle = booking?.showId?.movieId?.title || 'a movie';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Movie Ticket - BookMyShow',
          text: `Hey! Check out my ticket for ${movieTitle}!`,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Error sharing', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.info('Ticket link copied to clipboard!');
      } catch (err) {
        console.error('Clipboard failed', err);
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    
    const toastId = toast.loading('Generating your ticket PDF...', { position: 'bottom-center' });

    try {
      const element = ticketRef.current;
      
      // Use html-to-image to bypass the oklch/canvas bugs
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');
      pdf.save(`Ticket-${booking?._id?.substring(0, 8) || 'Booking'}.pdf`);
      
      toast.update(toastId, { render: 'Ticket downloaded successfully!', type: 'success', isLoading: false, autoClose: 2000 });
    } catch (error) {
      console.error('PDF Generation failed:', error);
      toast.update(toastId, { render: 'Failed to generate PDF. Check console for details.', type: 'error', isLoading: false, autoClose: 3000 });
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  if (!booking) return <div className="text-center py-20">Booking data not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in zoom-in-95 duration-1000">
      <div className="flex flex-col items-center mb-12 text-center space-y-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce shadow-lg shadow-green-200">
           <CheckCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter">Booking <span className="text-primary italic">Confirmed</span></h1>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Your cinematic journey begins now</p>
        </div>
      </div>

      {/* High Fidelity Ticket Receipt - (BookMyShow Style) */}
      <div ref={ticketRef} className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 relative max-w-2xl mx-auto">
         {/* Top Brand Strip */}
         <div style={{ backgroundColor: '#f84464' }} className="p-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-1">
               <span className="text-xl font-black tracking-tighter">BOOK</span>
               <span style={{ color: '#f84464' }} className="bg-white px-2 py-0.5 rounded-md text-lg font-black mx-0.5 italic shadow-lg shadow-black/10">YOUR</span>
               <span className="text-xl font-black tracking-tighter">SHOW</span>
            </div>
            <div className="text-[10px] items-center gap-2 flex font-black uppercase tracking-widest bg-black/10 px-4 py-2 rounded-full border border-white/10">
               <ShieldCheck className="w-3.5 h-3.5" /> Secured Ticket
            </div>
         </div>

         <div className="p-10 space-y-10">
            {/* Movie Info Section */}
            <div className="flex flex-col md:flex-row gap-10">
               <div className="w-32 aspect-[2/3] shrink-0 rounded-xl overflow-hidden shadow-xl border border-gray-100">
                  <img 
                    src={booking.showId.movieId.posterUrl} 
                    className="w-full h-full object-cover" 
                    alt="Poster" 
                    crossOrigin="anonymous"
                  />
               </div>
               
               <div className="flex-grow space-y-6">
                  <div className="space-y-2">
                     <h2 style={{ color: '#0c111b' }} className="text-3xl font-black tracking-tight">{booking.showId.movieId.title} (English)</h2>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin style={{ color: '#f84464' }} className="w-3 h-3" /> {booking.showId.theaterId.name}: {booking.showId.theaterId.location}
                     </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 bg-gray-100/50 p-5 rounded-2xl border border-gray-100">
                      <div className="space-y-1">
                         <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">SHOWTIME</p>
                         <p style={{ color: '#0c111b' }} className="text-xs font-black">{new Date(booking.showId.showTime).toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short' })}, {new Date(booking.showId.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">SEATS ({booking.seats.length})</p>
                         <p style={{ color: '#f84464' }} className="text-xs font-black tracking-tighter uppercase">{booking.seats.join(', ')}</p>
                      </div>
                  </div>
               </div>
            </div>

            {/* User & QR Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-10 border-t border-dashed border-gray-200">
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-100">
                        <User className="w-6 h-6 text-gray-400" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Booked For</p>
                        <p style={{ color: '#0c111b' }} className="text-sm font-black">{booking.userId.name}</p>
                     </div>
                  </div>
                  
                  <div className="flex gap-4">
                     <button 
                        onClick={handleShare}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors border border-gray-100 py-3 px-6 rounded-xl hover:bg-gray-50 shadow-sm active:scale-95 transition-all"
                     >
                        <Share2 className="w-4 h-4" /> Share
                     </button>
                     <button 
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors border border-gray-100 py-3 px-6 rounded-xl hover:bg-gray-50 shadow-sm active:scale-95 transition-all"
                     >
                        <Download className="w-4 h-4" /> Save PDF
                     </button>
                  </div>
               </div>

               <div className="relative group p-4 bg-white rounded-3xl shadow-2xl border border-gray-100 flex items-center justify-center">
                  <QRCodeCanvas 
                    value={`${window.location.origin}/success/${booking._id}`}
                    size={128}
                    className="relative z-10"
                    level="H"
                    includeMargin={true}
                  />
                  <div style={{ backgroundColor: '#f84464' }} className="absolute inset-0 opacity-5 blur-3xl rounded-full scale-50 group-hover:scale-100 transition-transform -z-10" />
               </div>
            </div>
         </div>

         {/* Receipt Footer */}
         <div style={{ backgroundColor: '#f9fafb' }} className="p-6 text-center border-t border-gray-100 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction ID: <span style={{ color: '#0c111b' }} className="font-black">{booking._id.toUpperCase()}</span></p>
            <p className="text-[9px] text-gray-400 font-medium italic">Present this digital ticket at the theatre entrance</p>
         </div>
      </div>

      <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8">
         <Link to="/" className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-all group">
            <ChevronLeft className="w-4 h-4" /> Back to Discovery
         </Link>
         <Link to="/profile" className="flex items-center gap-2 text-xs font-black text-secondary uppercase tracking-widest hover:text-primary transition-all group bg-white px-6 py-3 rounded-xl border border-gray-100 shadow-sm">
            View My Bookings <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
         </Link>
      </div>
    </div>
  );
};

const ShieldCheck = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default BookingSuccess;
