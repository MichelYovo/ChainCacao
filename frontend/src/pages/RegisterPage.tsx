import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/components/security/auth-context';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Smartphone, 
  User, 
  Mail, 
  Lock, 
  Sprout, 
  Building2, 
  Truck, 
  ShieldCheck,
  Landmark,
  Globe,
  Loader2
} from 'lucide-react';

const ROLES = [
  { id: 'Agriculteur', label: 'Agriculteur', icon: Sprout, description: 'Gestion des lots de récolte' },
  { id: 'Coopérative', label: 'Coopérative', icon: Building2, description: 'Collecte et groupage' },
  { id: 'Vérificateur', label: 'Vérificateur', icon: ShieldCheck, description: 'Certification & Audit GPS' },
  { id: 'Exportateur', label: 'Exportateur', icon: Truck, description: 'Transferts & Traçabilité' },
  { id: 'Transformateur', label: 'Transformateur', icon: Building2, description: 'Enregistrement transformation' },
  { id: 'Importateur', label: 'Importateur', icon: Globe, description: 'Conformité EUDR' },
  { id: 'Ministère', label: 'Ministère', icon: Landmark, description: 'Administration & Supervision' }
];

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-creme flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cacao-vert/5 rounded-full blur-[120px] -z-10" />
      
      <div className="w-full max-w-xl text-center space-y-8">
        <Link to="/login" className="inline-flex items-center gap-2 text-cafe-moyen hover:text-cafe-profondeur transition-colors mb-4">
          <ArrowLeft size={16} />
          <span className="text-xs font-black uppercase tracking-widest">Retour à la connexion</span>
        </Link>
        
        <div className="p-12 glass bg-white/90 shadow-2xl space-y-8">
          <div className="w-24 h-24 bg-cafe-profondeur/10 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="text-cafe-profondeur" size={48} />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-display font-bold text-cafe-profondeur">Accès Restreint</h2>
            <p className="text-cafe-moyen font-medium text-lg leading-relaxed px-6">
              Pour garantir l'intégrité de la filière cacao, la création de comptes est strictement gérée par l'<b>Administrateur Central</b>.
            </p>
          </div>

          <div className="p-6 bg-cafe-profondeur/5 rounded-3xl border border-cacao-dore/10">
            <p className="text-sm font-bold text-cafe-profondeur mb-2">Instructions pour l'obtention d'un compte :</p>
            <ul className="text-xs text-cafe-moyen text-left space-y-2 inline-block">
              <li className="flex items-center gap-2 font-bold"><Check size={14} className="text-cacao-vert" /> Présentez vos documents officiels de coopérative ou producteur.</li>
              <li className="flex items-center gap-2 font-bold"><Check size={14} className="text-cacao-vert" /> Contactez votre bureau d'appui technique ChainCacao local.</li>
              <li className="flex items-center gap-2 font-bold"><Check size={14} className="text-cacao-vert" /> L'administrateur vous fournira votre Identifiant et Mot de passe.</li>
            </ul>
          </div>

          <Link to="/login" className="w-full block py-5 bg-cafe-profondeur text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-cafe-moyen transition-colors">
            J'ai mes identifiants
          </Link>
        </div>
        
        <p className="text-[10px] text-cafe-clair uppercase font-extrabold tracking-widest leading-relaxed">
          Traçabilité • Transparence • Conformité EUDR<br />
          Système de Contrôle d'Accès Souverain
        </p>
      </div>
    </div>
  );
};
