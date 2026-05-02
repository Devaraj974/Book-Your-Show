import { create } from 'zustand';

const useAuthStore = create((set) => ({
  userInfo: localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null,
  
  login: (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
    set({ userInfo: data });
  },
  
  logout: () => {
    localStorage.removeItem('userInfo');
    set({ userInfo: null });
  }
}));

export default useAuthStore;
