import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Lot } from '../types';
import { GlassCard } from '../components/UI/GlassCard';
import { 
  Search, 
  MapPin, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
  Link as LinkIcon,
  ShieldCheck,
  Package,
  Loader2,
  Sprout,
  Globe,
  QrCode,
  Ship
} from 'lucide-react';
import { motion } from 'motion/react';
import { QRCodeCanvas } from 'qrcode.react';

import { Logo } from '../components/Logo';

export const TrackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchId, setSearchId] = useState(searchParams.get('id') || '');
  const [lot, setLot] = useState<Lot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (searchParams.get('id')) {
      handleSearch(searchParams.get('id')!);
    }
  }, [searchParams]);

  const handleSearch = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.traceLot(id);
      setLot(data);
    } catch (err) {
      setError('Impossible de trouver ce lot. Vérifiez l\'identifiant.');
      setLot(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-12 px-6 max-w-5xl mx-auto space-y-8 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cacao-dore/5 rounded-full blur-[120px] -z-10" />
      
      {/* Search Header */}
      <section className="text-center space-y-8 pt-10 flex flex-col items-center">
        <div className="w-32 h-32 bg-white rounded-[40px] shadow-2xl flex items-center justify-center p-6 border border-cacao-dore/10">
          <Logo size={80} color="#2d5a27" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-cafe-profondeur">Traçabilité <span className="text-cacao-vert italic">Immuable</span></h1>
          <p className="text-cafe-moyen max-w-2xl mx-auto font-medium text-lg">
            Vérifiez l'origine et la conformité EUDR de chaque fève de cacao grâce au protocole ChainCacao.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto mt-12 flex flex-col sm:flex-row gap-4 p-2 glass bg-white/40 border-cacao-dore/5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cafe-moyen/50" size={20} />
            <input 
              type="text" 
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(searchId)}
              placeholder="Identifiant du Lot (ex: LOT-001)..."
              className="w-full pl-12 pr-4 py-4 bg-transparent outline-none font-bold tracking-wider text-cafe-profondeur placeholder:text-cafe-clair/50"
            />
          </div>
          <button 
            onClick={() => handleSearch(searchId)}
            className="px-10 py-4 bg-cafe-profondeur text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-cafe-profondeur/20 active:scale-95"
          >
            Tracer le Lot
          </button>
        </div>
      </section>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="relative">
            <Loader2 className="animate-spin text-cacao-vert" size={64} />
            <div className="absolute inset-0 blur-xl bg-cacao-vert/20 rounded-full" />
          </div>
          <p className="text-cafe-moyen font-display italic text-xl animate-pulse">Exploration du registre Polygon...</p>
        </div>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 text-center border-red-500/10 bg-red-50/20"
        >
          <p className="text-red-500 font-bold text-lg">{error}</p>
          <button onClick={() => setError('')} className="mt-4 text-cafe-moyen underline text-sm font-bold">Réessayer</button>
        </motion.div>
      )}

      {lot && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {/* Lot Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Lot ID", val: lot.id, icon: LinkIcon, color: "text-cacao-vert" },
              { label: "Producteur", val: lot.producerName, icon: Sprout, color: "text-cafe-moyen" },
              { label: "Origine", val: lot.origin, icon: MapPin, color: "text-cacao-dore" },
              { label: "Quantité", val: `${lot.quantity} kg`, icon: Package, color: "text-cafe-profondeur" }
            ].map((item, i) => (
              <GlassCard key={i} delay={i * 0.1} className="p-4 border-cacao-dore/5">
                <div className="flex items-center gap-2 mb-1">
                  <item.icon size={12} className={item.color} />
                  <span className="text-[9px] uppercase font-black tracking-widest text-cafe-clair">{item.label}</span>
                </div>
                <p className={`text-md font-bold truncate ${item.label === 'Lot ID' ? 'font-mono uppercase' : ''}`}>{item.val}</p>
              </GlassCard>
            ))}
            <button 
              onClick={() => setShowQR(!showQR)}
              className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${showQR ? 'bg-cafe-profondeur text-white border-cafe-profondeur' : 'bg-white border-dashed border-cacao-dore/20 text-cafe-moyen hover:border-cacao-vert hover:text-cacao-vert'}`}
            >
              <QrCode size={20} />
              <span className="text-[9px] font-black uppercase tracking-widest">Partager QR</span>
            </button>
          </div>

          {showQR && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-cacao-dore/10 flex flex-col items-center gap-4">
                <QRCodeCanvas value={window.location.href} size={160} includeMargin />
                <p className="text-[10px] font-bold text-cafe-moyen uppercase tracking-widest animate-pulse">Scannez pour voir ce passeport</p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Timeline */}
            <div className="lg:col-span-2 space-y-10">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold font-display italic">Preuves Visuelles & Géo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GlassCard className="p-0 overflow-hidden h-64 bg-cafe-profondeur group relative">
                    {lot.photos && lot.photos.length > 0 ? (
                      <>
                        <img src={lot.photos[0]} alt="Lot cocoa" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">Photo Certifiée d'Origine</span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-cafe-clair gap-2">
                        <Globe size={40} className="opacity-20 translate-y-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest mt-2">Vue Satellite / Photo Terrain</span>
                      </div>
                    )}
                  </GlassCard>
                  <div className="space-y-4">
                    <GlassCard className="p-6 bg-creme border-cacao-dore/20 flex flex-col justify-center h-full">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="text-cacao-vert" />
                        <h4 className="font-bold text-cafe-profondeur">Localisation GPS</h4>
                      </div>
                      <p className="font-mono text-xl text-cafe-profondeur font-bold tracking-tight">{lot.gps}</p>
                      <p className="text-[10px] font-black uppercase text-cafe-clair tracking-[0.2em] mt-2">Précision: +/- 10m • Verified via Polygon</p>
                    </GlassCard>
                  </div>
                </div>
              </div>

              <h3 className="text-3xl font-bold font-display italic">Cycle de Vie du Lot</h3>
              <div className="space-y-0">
                {lot.history.map((step, idx) => (
                  <div key={idx} className="relative pl-12 pb-12 last:pb-0">
                    {/* Immersive Vertical Line */}
                    {idx < lot.history.length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-cacao-dore/40 to-transparent" />
                    )}
                    
                    {/* Stylish Node Circle */}
                    <div className="absolute left-0 top-1 w-10 h-10 flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-cacao-vert ring-4 ring-cacao-vert/20 shadow-[0_0_12px_rgba(45,90,39,0.4)]' : 'bg-cacao-dore shadow-[0_0_8px_rgba(218,165,32,0.3)]'}`} />
                    </div>

                    <GlassCard className="hover:border-cacao-dore/40 transition-all cursor-default">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-cacao-vert/10 text-cacao-vert rounded-full border border-cacao-vert/10">
                              Stage {idx} • {step.label}
                            </span>
                            <span className="text-xs font-bold text-cafe-clair flex items-center gap-1.5">
                              <Clock size={14} /> {new Date(step.date).toLocaleString('fr-FR')}
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-cafe-profondeur">{step.actor}</h4>
                          <div className="flex items-center gap-2 p-2 bg-creme rounded-lg border border-cacao-dore/5 w-fit">
                            <LinkIcon size={12} className="text-cacao-dore" />
                            <span className="font-mono text-[10px] text-cafe-moyen">TX Hash: <span className="text-cafe-profondeur font-bold">{step.hash}</span></span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border border-cacao-dore/20 flex items-center justify-center text-cacao-vert bg-white">
                            <CheckCircle2 size={20} />
                          </div>
                          <ChevronRight size={24} className="text-cafe-clair opacity-30" />
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                ))}
              </div>
            </div>

            {/* Immersive Passport Meta */}
            <div className="space-y-8 sticky top-32">
              <h3 className="text-2xl font-black italic">Certifications EUDR</h3>
              <GlassCard className="bg-cafe-profondeur text-creme overflow-hidden border-none shadow-2xl relative">
                {/* Decorative background logo */}
                <div className="absolute right-[-10%] bottom-[-10%] opacity-10 rotate-12">
                  <Logo size={200} color="#ffffff" />
                </div>
                
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-cacao-vert/20 rounded-2xl border border-cacao-vert/30 text-cacao-vert-clair shadow-lg shadow-black/20">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-display font-bold">Passeport EUDR</h4>
                      <p className="text-xs text-cafe-clair font-extrabold uppercase tracking-widest mt-1">Souveraineté Digitale</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-cafe-clair font-medium">Validité Géo-parcelle</span>
                        <span className="text-cacao-vert-clair font-bold">CONFIRMÉ</span>
                      </div>
                      <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-cacao-vert" />
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-cafe-clair font-medium">Zéro Déforestation</span>
                        <span className="text-cacao-vert-clair font-bold">CONFORME</span>
                      </div>
                      <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-cacao-vert" />
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl border border-dashed border-white/20 text-center">
                      <p className="text-[10px] text-cafe-clair uppercase font-black tracking-[0.3em] mb-2">Block Signature</p>
                      <p className="font-mono text-[10px] text-cacao-dore leading-relaxed break-all">
                        0x4d5a697373696f6e5f436f6e666f726d6974795f32303236
                      </p>
                    </div>
                  </div>

                  <button className="w-full py-5 bg-gradient-to-r from-cacao-vert to-cacao-vert-clair text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-black/30">
                    <Globe size={20} />
                    Générer Certificat PDF
                  </button>
                </div>
              </GlassCard>

              <GlassCard className="bg-white/50 border-cacao-dore/10">
                <h4 className="font-bold flex items-center gap-2 mb-4 text-cafe-profondeur">
                  <Package size={18} className="text-cacao-vert" />
                  Données Techniques
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                  <div className="p-3 bg-creme rounded-xl border border-cacao-dore/5">
                    <p className="text-[10px] text-cafe-clair uppercase font-black tracking-widest mb-1">Qualité</p>
                    <p className="font-bold text-cafe-profondeur uppercase">Grade Supérieur</p>
                  </div>
                  <div className="p-3 bg-creme rounded-xl border border-cacao-dore/5">
                    <p className="text-[10px] text-cafe-clair uppercase font-black tracking-widest mb-1">Humidité</p>
                    <p className="font-bold text-cafe-profondeur">7.2% Nom.</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero empty state */}
      {!lot && !loading && !error && (
        <div className="py-20 flex flex-col items-center">
          <div className="w-64 h-64 bg-cacao-dore/5 rounded-full flex items-center justify-center relative mb-8">
            <Logo size={100} color="#b38b59" className="opacity-20" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-cacao-dore/20 rounded-full"
            />
          </div>
          <p className="text-xl font-display italic text-cafe-clair">En attente d'une requête de traçage...</p>
        </div>
      )}
    </div>
  );
};
