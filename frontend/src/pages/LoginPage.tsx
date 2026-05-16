import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/components/security';
import { motion } from 'motion/react';
import { 
  Sprout, 
  ShieldCheck, 
  Truck, 
  Building2, 
  Globe, 
  Landmark,
  ArrowRight,
  Loader2,
  Users,
  Cog,
  Ship
} from 'lucide-react';

const ACTORS = [
  { id: "PROD-001", role: "Agriculteur", name: "Koffi Mensah", icon: Sprout, color: "text-cacao-vert", bg: "bg-cacao-vert/10" },
  { id: "COOP-011", role: "Coopérative", name: "Collectif Sud", icon: Users, color: "text-cafe-moyen", bg: "bg-cafe-moyen/10" },
  { id: "TRANS-77", role: "Transporteur", name: "Logistique Togo", icon: Truck, color: "text-orange-600", bg: "bg-orange-50" },
  { id: "EXP-500", role: "Exportateur", name: "Togo Export", icon: Globe, color: "text-cacao-dore", bg: "bg-cacao-dore/10" },
  { id: "BUY-EU-01", role: "Acheteur EU", name: "Acheteur Europe", icon: Ship, color: "text-blue-600", bg: "bg-blue-50" },
  { id: "MIN-AGRIC-01", role: "Ministère", name: "Min. Agriculture", icon: Landmark, color: "text-cafe-profondeur", bg: "bg-cafe-profondeur/10" }
];

import { Logo } from '@/components/ui/Logo';

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await login({ identifier, password });
      navigate('/dashboard');
    } catch (err) {
      setError('Identifiant ou mot de passe incorrect');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShortcutLogin = async (email: string, pass: string) => {
    setIdentifier(email);
    setPassword(pass);
    setIsSubmitting(true);
    setError('');
    try {
      await login({ identifier: email, password: pass });
      navigate('/dashboard');
    } catch (err) {
      setError('Identifiant ou mot de passe incorrect');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-creme flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Immersive background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cacao-vert opacity-5 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cacao-dore opacity-5 rounded-full blur-[120px] -ml-48 -mb-48" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col items-center gap-4 text-center"
      >
        <Link to="/" className="p-3 bg-white rounded-[32px] shadow-2xl border border-black/10 block mb-4 flex items-center justify-center translate-y-2">
          <Logo size={90} />
        </Link>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-cafe-profondeur font-display flex items-center gap-3">
             CHAINCACAO
          </h1>
          <p className="text-cafe-moyen font-medium tracking-[0.1em] uppercase text-[9px] mt-2">Console d'Ancrage Immuable • Togo</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-lg glass p-10 md:p-12 bg-white/60 shadow-2xl"
      >
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-display font-bold mb-2 italic">Authentification</h2>
          <p className="text-cafe-moyen text-sm font-medium">Connectez-vous avec vos accès officiels.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-cafe-clair ml-2">Identifiant (ID ou Email)</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-5 py-4 rounded-[20px] bg-white border border-cacao-dore/10 focus:border-cacao-vert focus:ring-4 focus:ring-cacao-vert/5 outline-none transition-all font-bold text-cafe-profondeur placeholder:text-cafe-clair/30 shadow-inner"
              placeholder="PROD-001 ou admin@chaincacao.tg"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-cafe-clair ml-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-[20px] bg-white border border-cacao-dore/10 focus:border-cacao-vert focus:ring-4 focus:ring-cacao-vert/5 outline-none transition-all font-bold text-cafe-profondeur placeholder:text-cafe-clair/30 shadow-inner"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && <p className="text-sm text-red-500 font-bold ml-2 animate-bounce">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-gradient-to-r from-cafe-profondeur to-[#4a3220] text-white rounded-[20px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-cafe-profondeur/30 transition-all disabled:opacity-50 mt-4"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Accéder au Registre
                <ArrowRight size={18} className="text-cacao-dore" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-cafe-clair text-center">Accès Raccourcis (Démo)</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ACTORS.map(actor => (
              <button
                key={actor.id}
                onClick={() => handleShortcutLogin(actor.id, 'password123')}
                className={`p-3 rounded-2xl border border-cacao-dore/5 ${actor.bg} flex flex-col items-center gap-1 hover:scale-105 transition-all group`}
              >
                <actor.icon size={16} className={actor.color} />
                <span className="text-[8px] font-black uppercase tracking-tighter text-cafe-profondeur group-hover:text-cacao-vert">{actor.role}</span>
              </button>
            ))}
            <button
               onClick={() => handleShortcutLogin('admin@chaincacao.tg', 'CacaoTogo2026!')}
               className="p-3 rounded-2xl border border-cacao-dore/5 bg-gray-100 flex flex-col items-center gap-1 hover:scale-105 transition-all group"
            >
              <Cog size={16} className="text-gray-600" />
              <span className="text-[8px] font-black uppercase tracking-tighter text-gray-600">Admin</span>
            </button>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-cacao-dore/10 text-center">
          <p className="text-[10px] text-cafe-clair font-bold uppercase tracking-widest leading-relaxed mb-4">
            Note: Contactez l'administrateur système pour obtenir vos identifiants ou réinitialiser votre accès.
          </p>
          <div className="flex justify-center gap-2">
             <div className="h-1 w-1 rounded-full bg-cacao-vert" />
             <div className="h-1 w-1 rounded-full bg-cacao-vert/60" />
             <div className="h-1 w-1 rounded-full bg-cacao-vert/30" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
