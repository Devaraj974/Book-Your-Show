import { useState, useEffect } from 'react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import { ChevronRight, Play, Loader2 } from 'lucide-react';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await api.get('/movies');
        setMovies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="space-y-12">
      {/* Banner Carousel */}
      <section className="relative h-[300px] lg:h-[480px] overflow-hidden rounded-2xl group shadow-2xl bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent z-10" />
        
        {/* Dynamic Banners */}
        {(() => {
          const banners = [
            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517604401157-538a9a4455de?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2000&auto=format&fit=crop"
          ];
          const [currentBanner, setCurrentBanner] = useState(0);

          useEffect(() => {
            const timer = setInterval(() => {
              setCurrentBanner((prev) => (prev + 1) % banners.length);
            }, 5000);
            return () => clearInterval(timer);
          }, []);

          return (
            <>
              {banners.map((url, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 transition-all duration-1000 transform ${idx === currentBanner ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                >
                  <img 
                    src={url} 
                    className="w-full h-full object-cover"
                    alt={`Banner ${idx + 1}`}
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute bottom-16 left-12 z-20 space-y-4 max-w-xl animate-in fade-in slide-in-from-left-8 duration-1000">
                      <span className="bg-primary text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">Featured</span>
                      <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">Experience Cinema Like Never Before</h2>
                      <p className="text-gray-200 text-sm lg:text-base font-medium drop-shadow-md">Book tickets for the latest blockbusters and exclusive events near you.</p>
                  </div>
                </div>
              ))}
              
              <div className="absolute bottom-8 right-12 z-20 flex gap-2">
                {banners.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentBanner(idx)}
                    className={`h-1 rounded-full transition-all duration-500 ${idx === currentBanner ? 'w-8 bg-primary shadow-lg shadow-primary/40' : 'w-4 bg-white/30 hover:bg-white/50'}`} 
                  />
                ))}
              </div>
            </>
          );
        })()}
      </section>

      {/* Recommended Movies Section */}
      <section className="space-y-8 fade-in-up">
        <div className="flex justify-between items-end border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-black text-secondary tracking-tight">Recommended Movies</h2>
          <button className="flex items-center gap-1 text-sm text-primary font-bold hover:underline transition-all">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-gray-400 font-medium animate-pulse">Loading movies...</p>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 xl:gap-8">
            {movies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="h-64 text-center flex flex-col items-center justify-center opacity-50 grayscale space-y-4">
              <p className="text-gray-400 font-medium italic">No movies available in your city yet.</p>
          </div>
        )}
      </section>
      
      {/* Stream Banner Placeholder (Screenshot 1-like) */}
      <section className="bg-white p-4 lg:p-8 rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3 aspect-video rounded-lg overflow-hidden bg-gray-100">
               <img src="https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:ote-MTUrIEV2ZW50cw%3D%3D,otc-FFFFFF,otf-Roboto,ots-64,ox-48,oy-320,ott-b:w-800:v-1/workshop-and-more-collection-202004271559.png" className="w-full h-full object-cover" alt="Workshop collection" />
            </div>
            <div className="md:w-2/3 space-y-4 text-center md:text-left">
                <h3 className="text-2xl font-black text-gray-800 leading-none">THE BEST OF <span className="text-primary tracking-tighter italic font-black">EVENTS</span> IN AHMEDABAD</h3>
                <p className="text-gray-500 font-medium text-sm">Explore premium workshops, shows, and offline events happening near you.</p>
                <div className="flex gap-4 items-center justify-center md:justify-start pt-2">
                    <button className="bg-primary text-white px-8 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all">Explore All</button>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em]">Updated 2 Hours Ago</span>
                </div>
            </div>
          </div>
      </section>
    </div>
  );
};

export default Home;
