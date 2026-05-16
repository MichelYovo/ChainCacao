import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sprout, ShieldCheck, Globe, ArrowRight, Smartphone, Zap } from 'lucide-react';

import { Logo } from '@/components/ui/logo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-creme selection:bg-cacao-dore/30 overflow-hidden relative">
      {/* Immersive decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cacao-vert/5 rounded-full blur-[140px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cacao-dore/5 rounded-full blur-[140px] -ml-64 -mb-64" />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-cafe-profondeur/5 rounded-full border border-cacao-dore/10">
              <Zap className="text-cacao-dore w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cafe-moyen">Protocole v1.0 • Polygon Ready</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-cafe-profondeur font-display leading-[0.9]">
              L'avenir du <span className="font-bold italic">Cacao</span> est digital.
            </h1>

            <p className="text-xl text-cafe-moyen font-medium max-w-xl leading-relaxed">
              La plateforme de traçabilité blockchain pour la filière <span className="font-bold italic">cacao</span> du Togo. 
              Garantissez l'origine, assurez la conformité EUDR et valorisez votre production.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-5 bg-cafe-profondeur text-white rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-cafe-profondeur/30 flex-1 sm:flex-none"
              >
                Commencer maintenant
                <ArrowRight size={18} className="text-cacao-dore" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-5 glass bg-white/50 text-cafe-profondeur rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center border border-cacao-dore/10 hover:bg-white transition-all shadow-lg flex-1 sm:flex-none"
              >
                Se connecter
              </button>
              <button
                onClick={() => navigate('/mobile')}
                className="px-8 py-5 bg-cacao-vert text-white rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-cacao-vert/20 w-full sm:w-auto"
              >
                <Smartphone size={18} />
                Installer App Mobile
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-cacao-dore/10">
              <div className="space-y-2">
                <Globe className="text-cacao-vert w-6 h-6" />
                <p className="text-[11px] font-black text-cafe-profondeur uppercase tracking-widest">Global EUDR</p>
                <p className="text-[10px] text-cafe-clair font-medium">Standard européen</p>
              </div>
              <div className="space-y-2">
                <ShieldCheck className="text-cacao-dore w-6 h-6" />
                <p className="text-[11px] font-black text-cafe-profondeur uppercase tracking-widest">Immuable</p>
                <p className="text-[10px] text-cafe-clair font-medium">Ancré sur Polygon</p>
              </div>
              <div className="space-y-2">
                <Smartphone className="text-cafe-moyen w-6 h-6" />
                <p className="text-[11px] font-black text-cafe-profondeur uppercase tracking-widest">Mobile First</p>
                <p className="text-[10px] text-cafe-clair font-medium">Accès en plein champ</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="absolute inset-0 bg-cacao-vert-clair/20 rounded-[60px] blur-[100px] animate-pulse" />
            <div className="glass overflow-hidden rounded-[48px] border-cacao-dore/10 shadow-[0_40px_100px_rgba(0,0,0,0.1)] relative z-10 aspect-[4/5] bg-gradient-to-br from-white/90 to-creme/90 flex flex-col">
              <div className="p-10 flex-1 flex flex-col justify-center items-center text-center space-y-8">
                <div className="w-32 h-32 bg-white rounded-[40px] flex items-center justify-center shadow-2xl rotate-3 p-2">
                  <Logo size={110} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-display font-bold text-cafe-profondeur">ChainCacao Protocol</h3>
                  <p className="text-cafe-moyen font-medium px-8 italic">
                    "La transparence est le terreau de la confiance. Ensemble, protégeons l'excellence du <span className="font-bold italic">cacao</span> togolais."
                  </p>
                </div>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-cafe-profondeur" />)}
                </div>
              </div>
              <div className="h-24 bg-cafe-profondeur flex items-center justify-between px-10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-[10px] font-mono text-white/50">NETWORK ACTIVE</span>
                </div>
                <div className="w-12 h-1 bg-cacao-dore/20 rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
