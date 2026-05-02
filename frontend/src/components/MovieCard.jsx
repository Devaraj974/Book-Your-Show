import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';

const MovieCard = ({ movie }) => {
  return (
    <Link 
      to={`/movie/${movie._id}`} 
      className="group block bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100/50"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={movie.posterUrl} 
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
            <button className="bg-primary text-white py-2 rounded-lg text-xs font-black uppercase tracking-widest mb-2 shadow-xl shadow-primary/40 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Book Now</button>
        </div>
        
        {/* Rating Bar overlay */}
        <div className="absolute bottom-0 w-full bg-secondary/80 backdrop-blur-md p-2 flex items-center justify-between text-white text-[10px] font-black tracking-wider">
            <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-primary fill-current" /> 8.5/10</span>
            <span className="text-gray-400">20K VOTES</span>
        </div>
      </div>
      
      <div className="p-4 space-y-1.5 bg-white">
        <h3 className="text-base font-black text-secondary group-hover:text-primary transition-colors line-clamp-1 tracking-tight">{movie.title}</h3>
        <p className="text-xs text-muted font-bold uppercase tracking-widest">{movie.genre.split(',')[0]} • {movie.language}</p>
      </div>
    </Link>
  );
};

export default MovieCard;
