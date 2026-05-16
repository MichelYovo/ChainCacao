import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/security';
import { Sprout, LogOut, Search, LayoutDashboard, Bell, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useOffline } from '@/hooks/useOffline';

import { Logo } from '@/components/ui/Logo';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isOffline = useOffline();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-8 border-b border-white/10 backdrop-blur-md bg-cafe-profondeur/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform shadow-lg">
              <Logo size={32} />
            </div>
            <h1 className="font-display text-xl font-bold tracking-tight text-white hidden sm:block">
              CHAINCACAO
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/track" 
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${location.pathname === '/track' ? 'text-cacao-dore' : 'text-cafe-clair hover:text-white'}`}
            >
              Traçabilité
            </Link>
            {user && (
              <div className="flex items-center gap-6">
                <Link 
                  to="/dashboard" 
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-2 ${location.pathname === '/dashboard' ? 'text-cacao-dore' : 'text-cafe-clair hover:text-white'}`}
                >
                  Registre
                </Link>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-full overflow-hidden">
                  <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-cacao-vert shadow-[0_0_8px_rgba(45,90,39,0.8)]'}`} />
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest">{user.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            {isOffline ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                <WifiOff size={14} className="text-red-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-red-500 hidden sm:block">Hors Connexion</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-cacao-vert/10 border border-cacao-vert/20 rounded-lg">
                <Wifi size={14} className="text-cacao-vert" />
                <span className="text-[9px] font-black uppercase tracking-widest text-cacao-vert hidden sm:block">Connecté</span>
              </div>
            )}
            
            {user ? (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white leading-none">{user.name}</p>
                  <p className="text-[10px] text-cacao-dore font-black tracking-widest mt-1 uppercase">{user.role}</p>
                </div>
                <button 
                  onClick={logout}
                  className="p-3 bg-white/5 border border-white/10 text-cafe-clair hover:text-red-400 rounded-xl transition-all"
                  title="Déconnexion"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-cafe-clair hover:text-white transition-colors">Connexion</Link>
              <Link to="/register" className="px-6 py-2.5 bg-cacao-vert text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-cacao-vert/20">S'inscrire</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  </nav>
  );
};
