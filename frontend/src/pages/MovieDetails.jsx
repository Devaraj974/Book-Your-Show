import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, MapPin, Clock, Star, Play, ChevronRight, Loader2, Info, Share2, Globe, Heart } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, showsRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get(`/shows/movie/${id}`)
        ]);
        setMovie(movieRes.data);
        setShows(Array.isArray(showsRes.data) ? showsRes.data : []);
      } catch (err) {
        console.error(err);
        setShows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleRateMovie = async () => {
    setSubmittingRating(true);
    try {
      const res = await api.post(`/movies/${id}/rate`, { rating: userRating });
      setMovie(res.data);
      setIsRatingModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Failed to submit rating. Please try again or log in.');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center space-y-4 bg-white/50 backdrop-blur-md rounded-2xl animate-pulse">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-gray-400 font-medium">Fetching showtimes...</p>
    </div>
  );
  
  if (!movie) return <div className="text-center py-20 text-2xl font-light italic opacity-50">Movie not found.</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 -mx-4 -mt-8">
      {/* Movie Hero Backdrop - (Screenshot 2-like) */}
      <section className="relative h-[550px] overflow-hidden group shadow-2xl bg-secondary">
        <div className="absolute inset-0">
          <img 
            src={movie.posterUrl} 
            className="w-full h-full object-cover opacity-30 blur-xl scale-110" 
            alt={movie.title}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 h-full flex flex-col md:flex-row gap-12 items-center md:items-end pb-16 relative z-20">
          <div className="relative group/poster w-64 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 transform -translate-y-8 animate-in slide-in-from-bottom-12 duration-1000">
            <img src={movie.posterUrl} className="w-full h-full object-cover" alt={movie.title} />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/poster:opacity-100 transition-opacity">
                <button className="bg-white/20 backdrop-blur-md p-6 rounded-full border border-white/20 hover:scale-110 transition-transform shadow-2xl"><Play className="w-10 h-10 text-white fill-current" /></button>
            </div>
            <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-lg">In Cinemas</div>
          </div>

          <div className="space-y-8 flex-grow pb-4">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white drop-shadow-2xl animate-in slide-in-from-left-12 duration-1000">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                 <div className="bg-white/5 backdrop-blur-xl px-5 py-3 rounded-2xl flex items-center gap-4 border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-2">
                        <Star className="w-6 h-6 text-primary fill-current" />
                        <span className="text-2xl font-black italic">{(movie.rating || 0).toFixed(1)}/10</span>
                    </div>
                    <div className="h-8 w-[1px] bg-white/10" />
                    <span className="text-sm font-bold text-gray-400">{movie.votes || 0} VOTES</span>
                    <button onClick={() => setIsRatingModalOpen(true)} className="ml-4 bg-primary hover:bg-primary-dark px-6 py-2 rounded-xl text-xs font-black transition-all shadow-lg shadow-primary/20">RATE NOW</button>
                 </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 font-black text-[11px] text-white/60 tracking-widest uppercase">
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><Clock className="w-4 h-4 text-primary" /> {movie.duration} MINS</span>
                <span>•</span>
                <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{movie.genre}</span>
                <span>•</span>
                <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">UA 13+</span>
                <span>•</span>
                <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">26 MAR, 2026</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
               <a href="#showtimes" className="bg-primary text-white px-12 py-4 rounded-2xl text-xl font-black tracking-tight hover:bg-primary-dark transition-all shadow-[0_10px_30px_rgba(248,68,100,0.4)] hover:-translate-y-1">
                 BOOK TICKETS
               </a>
               <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all border border-white/5 shadow-xl"><Share2 className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Showtime Grid - (Screenshot 3-like) */}
      <div id="showtimes" className="container mx-auto px-4 py-8 space-y-12">
        <section className="space-y-8">
            <div className="flex justify-between items-end border-b border-gray-200 pb-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-800 flex items-center gap-4">
                  <Calendar className="text-primary w-8 h-8" /> {movie.title} - (English)
                </h2>
                <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px]">{movie.genre} • UA13+ • {movie.duration}m</p>
              </div>
            </div>

            {shows.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                {Object.entries(
                  shows.reduce((acc, show) => {
                    const name = show.theaterId?.name || 'Unknown Theater';
                    if (!acc[name]) acc[name] = [];
                    acc[name].push(show);
                    return acc;
                  }, {})
                ).map(([theaterName, theaterShows]) => (
                  <div key={theaterName} className="p-6 md:p-8 flex flex-col md:flex-row gap-8 hover:bg-gray-50 transition-colors group">
                    <div className="md:w-1/3 space-y-2">
                        <div className="flex items-center gap-3">
                           <Heart className="w-5 h-5 text-gray-300 hover:text-primary transition-colors cursor-pointer" />
                           <h3 className="text-lg font-black text-gray-800 tracking-tight group-hover:text-primary transition-colors">{theaterName}</h3>
                           <Info className="w-4 h-4 text-gray-300 hover:text-dark transition-all cursor-help" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                           <MapPin className="w-3 h-3 text-primary" /> {theaterShows[0]?.theaterId?.location || 'Location missing'}
                        </p>
                    </div>

                    <div className="md:w-2/3 flex flex-wrap gap-4">
                      {theaterShows.map(show => (
                        <Link 
                          key={show._id} 
                          to={`/book/${show._id}`}
                          className="w-32 border border-green-200 bg-white p-3 rounded-lg flex flex-col items-center gap-1 hover:bg-green-500 hover:text-white transition-all group/time shadow-sm hover:border-green-600"
                        >
                          <span className="text-sm font-black group-hover/time:scale-110 transition-transform">
                            {new Date(show.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-[9px] uppercase font-bold text-gray-400 group-hover/time:text-white/80">Available</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-16 rounded-xl flex flex-col items-center justify-center text-center space-y-4 border border-gray-100">
                 <Info className="w-12 h-12 text-gray-200" />
                 <p className="text-xl font-light italic text-gray-400">No shows available for this movie currently.</p>
              </div>
            )}
        </section>

        {/* About Section */}
        <section className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-xl font-black text-gray-800">About the movie</h3>
            <p className="text-gray-600 font-medium leading-relaxed italic border-l-4 border-primary pl-6">
                "{movie.description}"
            </p>
        </section>
      </div>

      {/* Rating Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 space-y-6 animate-in zoom-in-95 duration-300 relative shadow-2xl text-center">
             <button 
                onClick={() => setIsRatingModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 transition-colors"
             >
                ✕
             </button>
             <h3 className="text-2xl font-black text-gray-800 tracking-tighter">How was the movie?</h3>
             <div className="flex justify-center items-center gap-2">
               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                 <Star 
                   key={star} 
                   className={`w-6 h-6 cursor-pointer transition-all ${star <= userRating ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-300 hover:text-yellow-200'}`}
                   onClick={() => setUserRating(star)}
                 />
               ))}
             </div>
             <div className="text-4xl font-black text-primary italic">{userRating} <span className="text-xl text-gray-400">/ 10</span></div>
             <button 
               onClick={handleRateMovie}
               disabled={submittingRating}
               className="w-full bg-primary text-white py-4 rounded-xl font-black tracking-widest uppercase shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 flex justify-center items-center gap-2"
             >
               {submittingRating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Rating'}
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
