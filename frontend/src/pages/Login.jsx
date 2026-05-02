import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { Mail, Lock, LogIn, Loader2, Heart } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white p-10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-1 group shrink-0">
          <span className="text-2xl font-black tracking-tighter text-secondary group-hover:text-primary transition-colors">BOOK</span>
          <span className="bg-primary text-white px-2 py-0.5 rounded-md text-xl font-black mx-0.5 italic shadow-lg shadow-primary/20">YOUR</span>
          <span className="text-2xl font-black tracking-tighter text-secondary group-hover:text-primary transition-colors">SHOW</span>
        </div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Movies • Events • Plays • Sports</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full bg-white border border-gray-200 rounded-md py-3.5 px-4 outline-none focus:border-primary transition-all text-sm font-medium"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full bg-white border border-gray-200 rounded-md py-3.5 px-4 outline-none focus:border-primary transition-all text-sm font-medium"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3.5 rounded-xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><LogIn className="w-4 h-4" /> Sign In</>}
        </button>
      </form>

      <div className="text-center space-y-6 pt-4 border-t border-gray-100">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Not a member yet?</p>
        <Link to="/register" className="w-full block border border-primary text-primary py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
           Join Now — It's Free!
        </Link>
        <div className="flex items-center justify-center gap-2 text-[9px] text-gray-300 font-bold uppercase tracking-[0.3em] pt-4">
           <Heart className="w-3 h-3 text-primary fill-current" /> Made for Movie Lovers
        </div>
      </div>
    </div>
  );
};

export default Login;
