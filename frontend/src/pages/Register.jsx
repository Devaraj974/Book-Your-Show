import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { Mail, Lock, User, Loader2, UserPlus, Heart } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      login(data);
      toast.success(`Welcome to Book Your Show, ${data.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Create your cinematic profile</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-white border border-gray-200 rounded-md py-3.5 px-4 outline-none focus:border-primary transition-all text-sm font-medium"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            placeholder="Create Password"
            className="w-full bg-white border border-gray-200 rounded-md py-3.5 px-4 outline-none focus:border-primary transition-all text-sm font-medium"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-white py-3.5 rounded-xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 mt-4"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Create Account</>}
        </button>
      </form>

      <div className="text-center space-y-4">
        <Link to="/login" className="text-xs font-bold text-gray-400 hover:text-primary transition-all uppercase tracking-widest">
           I already have an account
        </Link>
        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">
           <Heart className="w-3 h-3 text-primary fill-current" /> Together for Cinema
        </div>
      </div>
    </div>
  );
};

export default Register;
