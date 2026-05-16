import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/security';
import { api } from '@/services/api';
import { Lot, Stats } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatCard } from '@/components/ui/StatCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOffline } from '@/hooks/useOffline';
import { 
  Package, 
  Search, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Plus,
  Loader2,
  ExternalLink,
  Globe,
  ArrowRight,
  ArrowLeft,
  Sprout,
  Bell,
  Users,
  Camera,
  Maximize2,
  QrCode,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeCanvas } from 'qrcode.react';

import { Logo } from '@/components/ui/Logo';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isOffline = useOffline();
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboardInit', user?.role],
    queryFn: () => api.getDashboardInit(),
    refetchInterval: isOffline ? false : 30000,
    staleTime: 5000,
  });

  const stats = data?.stats as Stats | null;
  const lots = (data?.lots || []) as Lot[];
  const notifications = (data?.notifications || []) as any[];
  const usersList = (data?.users || []) as any[];

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLot, setNewLot] = useState({ quantity: 1000, origin: '', gps: '', photo: '', note: '' });
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [showPhotoChoice, setShowPhotoChoice] = useState(false);
  const [isAdminCreating, setIsAdminCreating] = useState(false);
  const [newUserAccount, setNewUserAccount] = useState({ name: '', email: '', password: '', role: 'Agriculteur', phone: '' });
  const [adminTab, setAdminTab] = useState<'lots' | 'users'>('lots');

  const createUserMutation = useMutation({
    mutationFn: (userData: any) => api.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardInit'] });
      setIsAdminCreating(false);
      setNewUserAccount({ name: '', email: '', password: '', role: 'Agriculteur', phone: '' });
    }
  });

  const addLotMutation = useMutation({
    mutationFn: (lotData: any) => api.addLot(lotData),
    onMutate: async (newLotData) => {
      await queryClient.cancelQueries({ queryKey: ['dashboardInit'] });
      const previousData = queryClient.getQueryData(['dashboardInit', user?.role]);
      
      if (previousData) {
        queryClient.setQueryData(['dashboardInit', user?.role], (old: any) => ({
          ...old,
          lots: [{ 
            ...newLotData, 
            id: 'TEMP-' + Date.now(), 
            producerId: user?.id, 
            producerName: user?.name,
            timestamp: new Date().toISOString(),
            status: 0,
            history: [{ label: 'Enregistrement...', date: new Date().toISOString() }] 
          }, ...old.lots]
        }));
      }
      return { previousData };
    },
    onError: (err, newLotData, context) => {
      queryClient.setQueryData(['dashboardInit', user?.role], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardInit'] });
      setShowAddForm(false);
      setNewLot({ quantity: 1000, origin: '', gps: '', photo: '', note: '' });
    }
  });

  const transitionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.transitionLot(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['dashboardInit'] });
      const previousData = queryClient.getQueryData(['dashboardInit', user?.role]);
      if (previousData) {
        queryClient.setQueryData(['dashboardInit', user?.role], (old: any) => ({
          ...old,
          lots: old.lots.map((l: any) => l.id === id ? { ...l, status: data.status } : l)
        }));
      }
      return { previousData };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['dashboardInit', user?.role], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardInit'] });
    }
  });

  const markReadMutation = useMutation({
    mutationFn: () => api.markNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardInit'] });
    }
  });

  const getWordCount = (str: string) => str.trim().split(/\s+/).filter(Boolean).length;

  const handlePhotoImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewLot({ ...newLot, photo: event.target?.result as string });
        setShowPhotoChoice(false);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getRoleStats = () => {
    if (user?.role === 'Agriculteur') {
      const myLots = lots.filter(l => l.producerId === user.id);
      return [
        { title: "Mes Lots", value: myLots.length, icon: Package, color: "bg-cacao-vert" },
        { title: "Poids Total", value: `${myLots.reduce((acc, l) => acc + l.quantity, 0)} kg`, icon: Globe, color: "bg-cafe-moyen" },
        { title: "Certifiés", value: myLots.filter(l => l.status >= 1).length, icon: ShieldCheck, color: "bg-cacao-vert-clair" },
        { title: "En attente", value: myLots.filter(l => l.status === 0).length, icon: Clock, color: "bg-cacao-dore" }
      ];
    }
    return [
      { title: "Lots Système", value: stats?.totalLots || 0, icon: Package, color: "bg-cacao-vert" },
      { title: "Volume National", value: `${(stats?.totalQuantity || 0).toLocaleString()} kg`, icon: Globe, color: "bg-cafe-moyen" },
      { title: "Transports Actifs", value: stats?.activeTransports || 0, icon: Truck, color: "bg-cacao-dore" },
      { title: "Taux Conformité", value: "98.5%", icon: ShieldCheck, color: "bg-cacao-vert-clair" }
    ];
  };

  if (isLoading && !data) return (
    <div className="min-h-screen flex items-center justify-center bg-creme">
      <div className="text-center space-y-4">
        <Loader2 className="animate-spin text-cacao-vert w-12 h-12 mx-auto" />
        <p className="text-[10px] font-black uppercase tracking-widest text-cafe-clair">Chargement du Registre Immuable...</p>
      </div>
    </div>
  );

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 relative overflow-hidden">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cacao-dore/10 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-cafe-profondeur text-white text-[9px] font-black uppercase tracking-widest rounded-full">
              ID: {user?.id}
            </span>
            <span className="px-3 py-1 bg-cacao-vert/10 text-cacao-vert text-[9px] font-black uppercase tracking-widest rounded-full">
              {user?.role} Access
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-cacao-dore/20 shadow-lg">
              <Logo size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-cafe-profondeur font-display uppercase italic">
              Console <span className="text-cafe-profondeur">Régistre</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-creme bg-cacao-vert flex items-center justify-center">
                  <ShieldCheck size={10} className="text-white" />
                </div>
              ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-cacao-vert/60">Contrôle Multi-Signature Actif</p>
          </div>
          <p className="text-cafe-moyen font-medium text-lg leading-tight">
            Connecté en tant que <span className="font-bold text-cafe-profondeur underline decoration-cacao-dore/40 decoration-4">{user?.name}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-creme-sombre/30 rounded-xl">
             <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-red-500 animate-pulse' : 'bg-cacao-vert'}`} />
             <span className="text-[10px] font-black uppercase tracking-widest text-cafe-moyen">
               {isOffline ? 'Mode Hors Ligne' : 'Synchronisé'}
             </span>
          </div>
          {user?.role === 'Agriculteur' && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-6 py-4 bg-cafe-profondeur text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-transform shadow-xl shadow-black/10"
            >
              <Plus size={16} /> Enregistrer Récolte
            </button>
          )}
          <button className="px-6 py-4 bg-white border border-cacao-dore/20 text-cafe-profondeur rounded-2xl font-black text-[10px] uppercase tracking-widest">
            Audit Blockchain
          </button>
        </div>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {getRoleStats().map((stat, i) => (
          <StatCard key={i} title={stat.title} value={stat.value.toString()} icon={stat.icon} colorClass={stat.color} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Work Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Action Zone: ROLE SPECIFIC */}
          {user?.role === 'Agriculteur' && (
            <GlassCard className="p-8 bg-creme/30 border-cacao-dore/10">
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black italic">Vos Récoltes Actives</h3>
                  <p className="text-cafe-moyen text-sm font-medium">Récupérez vos QR codes et suivez la validation.</p>
                </div>
                <Logo size={64} className="opacity-20" />
              </div>
              <div className="mt-8 space-y-4">
                {lots.filter(l => l.producerId === user.id).slice(0, 3).map(lot => (
                  <div key={lot.id} className="p-4 bg-white/80 rounded-2xl border border-cacao-dore/5 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setSelectedQR(lot.id)}
                        className="w-10 h-10 rounded-xl bg-cafe-profondeur flex items-center justify-center text-white hover:bg-cacao-vert transition-colors"
                        title="Voir QR Code"
                      >
                        <QrCode size={20} />
                      </button>
                      <div>
                        <p className="text-sm font-bold text-cafe-profondeur">{lot.quantity} kg • {lot.origin}</p>
                        <p className="text-[10px] font-bold text-cafe-clair uppercase tracking-widest">{lot.history[lot.history.length-1].label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {lot.photos && lot.photos.length > 0 && (
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-cacao-dore/20">
                          <img src={lot.photos[0]} alt="Lot" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <Link to={`/track?id=${lot.id}`} className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight size={18} className="text-cacao-vert" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {user?.role === 'Coopérative' && (
            <GlassCard className="p-8 bg-cafe-moyen text-white border-none shadow-2xl shadow-cafe-moyen/20">
              <h3 className="text-2xl font-black italic mb-2">Files d'Attente de Certification</h3>
              <p className="text-creme/70 text-sm mb-8">Vérifiez les preuves de non-déforestation EUDR pour les lots ci-dessous.</p>
              
              <div className="space-y-4">
                {lots.filter(l => l.status === 0).length === 0 ? (
                  <p className="text-center py-8 text-creme/50 uppercase text-xs font-black tracking-widest">Aucun lot en attente</p>
                ) : (
                  lots.filter(l => l.status === 0).map(lot => (
                    <div key={lot.id} className="p-6 bg-white/10 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-lg">{lot.id} • {lot.producerName}</p>
                          <p className="text-xs text-creme/60 font-mono italic">{lot.gps}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => transitionMutation.mutate({ id: lot.id, data: { status: 1, label: "Certifié par Coopérative", nextRole: "Transporteur" } })}
                          className="px-6 py-3 bg-cacao-vert text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                          Certifier EUDR
                        </button>
                        <button className="px-6 py-3 bg-red-500/80 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Rejeter</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          )}

          {user?.role === 'Transporteur' && (
            <div className="space-y-6">
              <h3 className="text-3xl font-black italic text-cafe-profondeur">Plan de Transport</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lots.filter(l => l.status === 1).map(lot => (
                  <div key={lot.id} className="glass p-6 border-orange-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                        <Truck size={24} />
                      </div>
                      <span className="text-[10px] font-black uppercase bg-orange-50 text-orange-600 px-3 py-1 rounded-full">Prêt pour transit</span>
                    </div>
                    <h4 className="font-display font-bold text-xl mb-1">{lot.id}</h4>
                    <p className="text-cafe-clair text-xs font-bold uppercase tracking-widest mb-6">Chargement: {lot.origin}</p>
                    <button 
                      onClick={() => transitionMutation.mutate({ id: lot.id, data: { status: 2, label: "En Transit Logistique", nextRole: "Exportateur" } })}
                      className="w-full py-4 bg-cafe-profondeur text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-cafe-moyen transition-colors"
                    >
                      Démarrer Livraison
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {user?.role === 'Exportateur' && (
            <GlassCard className="p-8 bg-cacao-dore text-cafe-profondeur border-none shadow-xl shadow-cacao-dore/10">
              <h3 className="text-2xl font-black italic mb-6">Contrôle Réception Portuaire</h3>
              <div className="space-y-4">
                {lots.filter(l => l.status === 2).map(lot => (
                  <div key={lot.id} className="p-6 bg-white/40 rounded-3xl border border-white/20 flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold">Lot {lot.id}</p>
                      <p className="text-xs font-black uppercase tracking-widest opacity-60">Arrivée prévue au Port de Lomé</p>
                    </div>
                    <button 
                      onClick={() => transitionMutation.mutate({ id: lot.id, data: { status: 3, label: "Reçu par l'Exportateur", nextRole: "Acheteur EU" } })}
                      className="px-8 py-4 bg-cafe-profondeur text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                      Confirmer Réception
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {user?.role === 'Acheteur EU' && (
            <GlassCard className="p-8 bg-blue-600 text-white border-none shadow-xl shadow-blue-500/20">
              <h3 className="text-2xl font-black italic mb-6">Réception de Lots (Europe)</h3>
              <div className="space-y-4">
                {lots.filter(l => l.status === 3).map(lot => (
                  <div key={lot.id} className="p-6 bg-white/10 rounded-3xl border border-white/20 flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold">Lot {lot.id}</p>
                      <p className="text-xs font-black uppercase tracking-widest opacity-60">Chargé au Port de Lomé • En mer</p>
                    </div>
                    <button 
                      onClick={() => transitionMutation.mutate({ id: lot.id, data: { status: 4, label: "Livraison Confirmée EU", nextRole: null as any } })}
                      className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                      Confirmer Réception
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {user?.role === 'Administrateur' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 bg-white/40 p-1.5 rounded-2xl border border-cacao-dore/5 w-fit">
                <button 
                  onClick={() => setAdminTab('lots')}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${adminTab === 'lots' ? 'bg-cafe-profondeur text-white shadow-lg' : 'text-cafe-moyen hover:bg-white/50'}`}
                >
                  Suivi des Lots
                </button>
                <button 
                  onClick={() => setAdminTab('users')}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${adminTab === 'users' ? 'bg-cafe-profondeur text-white shadow-lg' : 'text-cafe-moyen hover:bg-white/50'}`}
                >
                  Comptes Système
                </button>
              </div>

              {adminTab === 'lots' ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-3xl font-black italic text-cafe-profondeur">Flux de Production</h3>
                  </div>
                  {/* The global activity table below will show the lots */}
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-3xl font-black italic text-cafe-profondeur">Gestion des Acteurs</h3>
                    <button 
                      onClick={() => setIsAdminCreating(true)}
                      className="px-6 py-3 bg-cafe-profondeur text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                    >
                      Ajouter Acteur
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {usersList.map((u: any) => (
                      <GlassCard key={u.id} className="p-6 space-y-4 border-cacao-dore/10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-cafe-profondeur/5 flex items-center justify-center text-cafe-profondeur">
                            <Users size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg leading-none">{u.name}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-cacao-vert mt-1">{u.role}</p>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs">
                          <p className="flex justify-between text-cafe-moyen"><span>ID:</span> <span className="font-mono font-bold text-cafe-profondeur">{u.id}</span></p>
                          <p className="flex justify-between text-cafe-moyen"><span>Email:</span> <span className="font-bold text-cafe-profondeur text-right truncate ml-4">{u.email}</span></p>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {user?.role === 'Ministère' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="p-6 bg-white border-l-4 border-l-cacao-vert">
                  <p className="text-[10px] font-black uppercase tracking-widest text-cafe-clair">Production Nationale</p>
                  <p className="text-3xl font-bold text-cafe-profondeur">184,200 <span className="text-xs">kg</span></p>
                </GlassCard>
                <GlassCard className="p-6 bg-white border-l-4 border-l-cacao-dore">
                  <p className="text-[10px] font-black uppercase tracking-widest text-cafe-clair">Producteurs Actifs</p>
                  <p className="text-3xl font-bold text-cafe-profondeur">1,450</p>
                </GlassCard>
                <GlassCard className="p-6 bg-white border-l-4 border-l-cafe-moyen">
                  <p className="text-[10px] font-black uppercase tracking-widest text-cafe-clair">Audits EUDR</p>
                  <p className="text-3xl font-bold text-cafe-profondeur">98% <span className="text-xs text-green-500">Conforme</span></p>
                </GlassCard>
              </div>

              <GlassCard className="p-8 bg-cafe-profondeur text-white min-h-[300px] flex flex-col justify-center items-center text-center overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="relative z-10 space-y-4">
                  <Globe size={64} className="mx-auto text-cacao-dore animate-pulse" />
                  <h3 className="text-2xl font-bold tracking-tight">Carte Interactive de la Filière</h3>
                  <p className="text-cafe-clair max-w-md mx-auto text-sm">Visualisation géo-spatiale des parcelles certifiées sur l'ensemble du territoire togolais. Données satellites Sentinel-2 synchronisées.</p>
                  <button className="px-6 py-3 bg-cacao-dore text-cafe-profondeur rounded-xl text-[10px] font-black uppercase tracking-widest">Activer Vue Satellite</button>
                </div>
              </GlassCard>
            </div>
          )}

          {/* Unified Global Activity Table */}
          <div className="glass border-cacao-dore/10 overflow-hidden">
            <div className="p-6 border-b border-cacao-dore/10 flex justify-between items-center bg-white/60">
              <h4 className="font-display font-bold text-xl italic uppercase tracking-tighter">Journal du Registre</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cafe-clair">Live PolySync</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-cafe-profondeur text-white text-[10px] uppercase tracking-[0.2em] font-black">
                  <tr>
                    <th className="px-6 py-4">Séquence</th>
                    <th className="px-6 py-4">Origine</th>
                    <th className="px-6 py-4">Quantité</th>
                    <th className="px-6 py-4">Validation</th>
                    <th className="px-6 py-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {lots.map((lot) => (
                    <tr key={lot.id} className="border-b border-cacao-dore/5 hover:bg-cafe-profondeur/[0.02] transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-cacao-vert uppercase tracking-tighter text-lg leading-none">#{lot.id.split('-')[1]}</span>
                          <span className="text-[9px] font-black uppercase text-cafe-clair mt-1 italic tracking-widest">Block 0x{lot.id.split('-')[1]}...</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-cafe-profondeur">{lot.origin}</span>
                          <span className="text-[10px] font-medium text-cafe-moyen">{lot.producerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-mono font-black text-cafe-profondeur">{lot.quantity} KG</td>
                      <td className="px-6 py-5">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                          lot.status === 4 
                            ? 'bg-cacao-vert/10 text-cacao-vert border-cacao-vert/20' 
                            : 'bg-orange-50 text-orange-600 border-orange-100'
                        }`}>
                          {lot.history[lot.history.length-1].label}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Link to={`/track?id=${lot.id}`} className="w-8 h-8 rounded-full border border-cacao-dore/20 flex items-center justify-center text-cafe-clair hover:text-cacao-vert hover:border-cacao-vert transition-all">
                          <ArrowRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Space */}
        <div className="lg:col-span-4 space-y-6">
          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black italic tracking-tighter">Alertes Systèmes</h3>
              {notifications.some(n => !n.read) && (
                <button onClick={() => markReadMutation.mutate()} className="text-[9px] font-black uppercase tracking-widest text-cacao-vert hover:underline underline-offset-4">Tout marquer lu</button>
              )}
            </div>
            <div className="space-y-3">
              {notifications.filter(n => n.toRole === user?.role).length === 0 ? (
                <div className="p-12 glass border-dashed flex flex-col items-center opacity-40">
                  <Package className="mb-2 text-cafe-clair" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-cafe-clair">Registre à jour</p>
                </div>
              ) : (
                notifications.filter(n => n.toRole === user?.role).map(n => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={n.id} 
                    className={`p-4 rounded-3xl border transition-all ${n.read ? 'bg-white/40 opacity-60 border-transparent' : 'bg-white border-cacao-dore/20 shadow-xl shadow-black/5 ring-1 ring-black/5'}`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center ${n.type === 'warning' ? 'bg-red-50 text-red-500' : 'bg-cacao-vert/10 text-cacao-vert'}`}>
                        <Bell size={16} />
                      </div>
                      <div className="space-y-1">
                        <p className={`text-xs font-bold leading-snug ${n.read ? 'text-cafe-moyen' : 'text-cafe-profondeur'}`}>{n.message}</p>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-cafe-clair">{new Date(n.date).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Network Stats */}
          <GlassCard className="bg-cafe-profondeur text-creme border-none overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
              <Globe size={120} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cacao-dore mb-6">Métriques Globales</h4>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-display font-bold text-white tracking-tighter">98.5%</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-cafe-clair mt-1">Score Conformité EUDR</p>
                </div>
                <ShieldCheck className="text-cacao-vert" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-cafe-clair">
                  <span>Transactions Polygon</span>
                  <span className="text-white">Active</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "92%" }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-cacao-vert shadow-[0_0_8px_rgba(45,90,39,1)]" 
                  />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] font-mono text-cafe-clair break-all">Last_TX: 0x8a92e100...44cb1</p>
              </div>
            </div>
          </GlassCard>

          {/* Quick Info */}
          <div className="p-8 glass bg-cacao-vert/5 border-cacao-vert/20 text-center space-y-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Package className="text-cacao-vert" />
            </div>
            <h5 className="font-bold text-cafe-profondeur uppercase tracking-tighter text-xl italic">Soutien Technique</h5>
            <p className="text-xs text-cafe-moyen leading-relaxed font-medium">Besoin d'aide pour l'enregistrement GPS ? Contactez le bureau d'appui de <b>Kpalimé</b>.</p>
            <button className="text-[10px] font-black uppercase tracking-widest text-cacao-vert hover:underline decoration-2">Lancer support live</button>
          </div>
        </div>
      </div>

      {/* MODAL OVERLAY */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-cafe-profondeur/80 backdrop-blur-md" onClick={() => setShowAddForm(false)} />
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-xl glass bg-white border-white p-8 md:p-12 relative z-10 shadow-2xl"
          >
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-display font-bold italic tracking-tighter">Nouveau Lot Récolté</h3>
                <p className="text-cafe-moyen font-medium text-lg italic underline decoration-cacao-dore decoration-2 underline-offset-4 mt-1">Saisie de Données Immuables</p>
              </div>
              <button 
                onClick={() => setShowAddForm(false)}
                className="w-10 h-10 rounded-full bg-creme flex items-center justify-center text-cafe-profondeur hover:rotate-90 transition-transform"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); addLotMutation.mutate({ ...newLot, photos: newLot.photo ? [newLot.photo] : [] }); }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cafe-clair ml-2">Quantité Net (kg)</label>
                  <input 
                    type="number" 
                    value={newLot.quantity}
                    onChange={e => setNewLot({...newLot, quantity: parseInt(e.target.value)})}
                    className="w-full px-6 py-4 bg-creme border border-cacao-dore/20 rounded-[20px] outline-none focus:ring-2 ring-cacao-vert/20 focus:border-cacao-vert transition-all font-bold text-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cafe-clair ml-2">Région Origine</label>
                  <input 
                    type="text" 
                    placeholder="ex: Plateau-Zone C"
                    value={newLot.origin}
                    onChange={e => setNewLot({...newLot, origin: e.target.value})}
                    className="w-full px-6 py-4 bg-creme border border-cacao-dore/20 rounded-[20px] outline-none focus:ring-2 ring-cacao-vert/20 focus:border-cacao-vert transition-all font-bold text-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cafe-clair ml-2">Photo du Produit</label>
                <div className="flex gap-4">
                  {!newLot.photo ? (
                    <div className="flex-1 flex gap-2">
                       <label className="flex-1 px-4 py-4 bg-creme border-2 border-dashed border-cacao-dore/40 rounded-[20px] flex items-center justify-center gap-2 text-cafe-moyen hover:border-cacao-vert hover:text-cacao-vert transition-all cursor-pointer">
                        <Camera size={18} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Photographier</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          capture="environment" 
                          className="hidden" 
                          onChange={handlePhotoImport} 
                        />
                      </label>
                      <label className="flex-1 px-4 py-4 bg-creme border-2 border-dashed border-cacao-dore/40 rounded-[20px] flex items-center justify-center gap-2 text-cafe-moyen hover:border-cacao-vert hover:text-cacao-vert transition-all cursor-pointer">
                        <Maximize2 size={18} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Galerie</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoImport} />
                      </label>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center gap-4 p-4 bg-creme rounded-2xl border border-cacao-vert/30">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-cacao-vert shadow-lg shrink-0">
                        <img src={newLot.photo} className="w-full h-full object-cover" alt="Preview" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase text-cacao-vert">Photo capturée</p>
                        <button type="button" onClick={() => setNewLot({...newLot, photo: ''})} className="text-[9px] font-bold text-red-500 uppercase hover:underline">Supprimer</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cafe-clair ml-2">Notes de Récolte ({getWordCount(newLot.note)}/80 mots)</label>
                <textarea 
                  placeholder="Ex: Récolte du matin après la pluie. Fèves de qualité A..."
                  value={newLot.note}
                  onChange={e => {
                    if (getWordCount(e.target.value) <= 80 || e.target.value.length < newLot.note.length) {
                      setNewLot({...newLot, note: e.target.value});
                    }
                  }}
                  className="w-full px-6 py-4 bg-creme border border-cacao-dore/20 rounded-[20px] outline-none focus:ring-2 ring-cacao-vert/20 focus:border-cacao-vert transition-all font-medium text-sm h-32"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cafe-clair ml-2">Ancrage GPS (Latitude, Longitude)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="6.9103, 0.6385"
                    value={newLot.gps}
                    onChange={e => setNewLot({...newLot, gps: e.target.value})}
                    className="w-full px-6 py-4 bg-creme border border-cacao-dore/20 rounded-[20px] outline-none focus:ring-2 ring-cacao-vert/20 focus:border-cacao-vert transition-all font-bold text-lg pr-14"
                    required
                  />
                  <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 text-cacao-vert" size={20} />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button 
                  type="submit"
                  className="w-full py-5 bg-cafe-profondeur text-white rounded-[24px] font-black uppercase tracking-[0.3em] text-xs hover:bg-cacao-vert transition-colors shadow-2xl shadow-black/20 flex items-center justify-center gap-3"
                >
                  Signer & Générer QR Code
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Admin Create User Modal */}
      {isAdminCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-cafe-profondeur/80 backdrop-blur-md" onClick={() => setIsAdminCreating(false)} />
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-xl glass bg-white border-white p-8 md:p-12 relative z-10 shadow-2xl"
          >
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-display font-bold italic tracking-tighter">Nouvel Acteur Filière</h3>
                <p className="text-cafe-moyen font-medium text-lg italic underline decoration-cacao-dore decoration-2 underline-offset-4 mt-1">Génération d'Identifiants Officiels</p>
              </div>
              <button 
                onClick={() => setIsAdminCreating(false)}
                className="w-10 h-10 rounded-full bg-creme flex items-center justify-center text-cafe-profondeur hover:rotate-90 transition-transform"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); createUserMutation.mutate(newUserAccount); }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-cafe-clair ml-2">Nom Complet / Organisation</label>
                <input 
                  type="text" 
                  value={newUserAccount.name}
                  onChange={e => setNewUserAccount({...newUserAccount, name: e.target.value})}
                  className="w-full px-5 py-3 bg-creme border border-cacao-dore/20 rounded-[15px] outline-none focus:border-cacao-vert transition-all font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-cafe-clair ml-2">Email Professionnel</label>
                  <input 
                    type="email" 
                    value={newUserAccount.email}
                    onChange={e => setNewUserAccount({...newUserAccount, email: e.target.value})}
                    className="w-full px-5 py-3 bg-creme border border-cacao-dore/20 rounded-[15px] outline-none focus:border-cacao-vert transition-all font-bold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-cafe-clair ml-2">Mot de Passe</label>
                  <input 
                    type="text" 
                    value={newUserAccount.password}
                    onChange={e => setNewUserAccount({...newUserAccount, password: e.target.value})}
                    className="w-full px-5 py-3 bg-creme border border-cacao-dore/20 rounded-[15px] outline-none focus:border-cacao-vert transition-all font-bold"
                    placeholder="password123"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-cafe-clair ml-2">Rôle Système</label>
                  <select 
                    value={newUserAccount.role}
                    onChange={e => setNewUserAccount({...newUserAccount, role: e.target.value})}
                    className="w-full px-5 py-3 bg-creme border border-cacao-dore/20 rounded-[15px] outline-none focus:border-cacao-vert transition-all font-bold"
                  >
                    <option value="Agriculteur">Agriculteur</option>
                    <option value="Coopérative">Coopérative</option>
                    <option value="Transporteur">Transporteur</option>
                    <option value="Exportateur">Exportateur</option>
                    <option value="Acheteur EU">Acheteur EU</option>
                    <option value="Ministère">Ministère</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-cafe-clair ml-2">Téléphone</label>
                  <input 
                    type="text" 
                    value={newUserAccount.phone}
                    onChange={e => setNewUserAccount({...newUserAccount, phone: e.target.value})}
                    className="w-full px-5 py-3 bg-creme border border-cacao-dore/20 rounded-[15px] outline-none focus:border-cacao-vert transition-all font-bold"
                    placeholder="+228..."
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-4 bg-cafe-profondeur text-white rounded-[20px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-cacao-vert transition-colors shadow-xl"
                >
                  Enregistrer & Générer ID
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* QR Code Modal */}
      <AnimatePresence>
        {selectedQR && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-cafe-profondeur/90 backdrop-blur-sm" onClick={() => setSelectedQR(null)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-12 rounded-[40px] shadow-2xl relative z-10 text-center space-y-8 max-w-sm w-full"
            >
              <div className="space-y-2">
                <h3 className="text-3xl font-display font-bold tracking-tighter">Passeport Digital</h3>
                <p className="text-sm font-black uppercase tracking-widest text-cacao-vert">Lot #{selectedQR.split('-')[1]}</p>
              </div>
              
              <div className="bg-white p-6 rounded-3xl shadow-inner inline-block mx-auto">
                <QRCodeCanvas 
                  value={`${window.location.origin}/track?id=${selectedQR}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-creme rounded-2xl">
                  <p className="text-[8px] font-black uppercase text-cafe-clair mb-1">Poids</p>
                  <p className="text-sm font-bold">{lots.find(l => l.id === selectedQR)?.quantity} kg</p>
                </div>
                <div className="p-4 bg-creme rounded-2xl">
                  <p className="text-[8px] font-black uppercase text-cafe-clair mb-1">Origine</p>
                  <p className="text-sm font-bold truncate">{lots.find(l => l.id === selectedQR)?.origin}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedQR(null)}
                className="w-full py-4 bg-cafe-profondeur text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
              >
                Fermer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
