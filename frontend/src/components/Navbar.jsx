import { Link } from 'react-router-dom';
import { Search, ChevronDown, Menu, User, LogOut, Settings } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const { userInfo, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-8">
        <Link to="/" className="flex items-center gap-1 group shrink-0">
          <span className="text-2xl font-black tracking-tighter text-secondary group-hover:text-primary transition-colors">BOOK</span>
          <span className="bg-primary text-white px-2 py-0.5 rounded-md text-xl font-black mx-0.5 italic shadow-lg shadow-primary/20">YOUR</span>
          <span className="text-2xl font-black tracking-tighter text-secondary group-hover:text-primary transition-colors">SHOW</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-grow max-w-2xl hidden md:flex items-center bg-white border border-gray-200 rounded-md px-4 py-2 group focus-within:border-gray-400 transition-all">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search for Movies, Events, Plays, Sports and Activities"
            className="w-full bg-transparent border-none focus:ring-0 text-sm px-3 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <button className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-dark transition-colors">
            Ahmedabad <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          
          {userInfo ? (
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">Hi, {userInfo.name}</span>
              <div className="flex items-center gap-1">
                {userInfo.role === 'admin' && (
                  <Link to="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-primary" title="Admin Dashboard">
                    <Settings className="w-5 h-5" />
                  </Link>
                )}
                <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Profile">
                  <User className="w-5 h-5 text-gray-600" />
                </Link>
                <button onClick={logout} className="p-2 hover:bg-red-50 rounded-full transition-colors text-gray-400 hover:text-primary" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/register" className="text-xs font-bold text-gray-500 hover:text-primary transition-colors hidden sm:block">
                Register
              </Link>
              <Link to="/login" className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-primary-dark transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Sign In
              </Link>
            </div>
          )}
          
          <button className="p-1 hover:bg-gray-100 rounded transition-colors md:hidden">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar (Removed dead links as requested) */}
    </header>
  );
};

export default Navbar;
