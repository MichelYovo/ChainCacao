import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/Auth/AuthContext';
import { api } from '../services/api';
import { Lot } from '../types';
import { GlassCard } from '../components/UI/GlassCard';
import { StatCard } from '../components/UI/StatCard';
import { 
  Plus, Loader2, Package, CheckCircle2, Truck, Zap,
  Globe, BarChart3, Users, Settings, ArrowRight, Bell, Search
} from 'lucide-react';
import { motion } from 'motion/react';

export const RoleDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const data = await api.getDashboardInit();
      setStats(data.stats);
      setLots(data.lots);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, lot: Lot) => {
    try {
      let endpoint = '';
      if (user?.role === 'Coopérative') {
        endpoint = action === 'receive' ? `/api/cacao/receive/${lot.id}` : `/api/cacao/certify/${lot.id}`;
      } else if (user?.role === 'Transporteur') {
        endpoint = `/api/cacao/transport/${lot.id}`;
      } else if (user?.role === 'Transformateur') {
        endpoint = `/api/cacao/transform/${lot.id}`;
      } else if (user?.role === 'Exportateur') {
        endpoint = `/api/cacao/export/${lot.id}`;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        await fetchDashboard();
        setSelectedLot(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-creme p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-display font-bold text-cafe-profondeur mb-2">
                {user?.role} Dashboard
              </h1>
              <p className="text-cafe-moyen">Bienvenue, {user?.name}</p>
            </div>
            <div className="flex gap-3">
              <button className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition">
                <Bell size={20} className="text-cafe-moyen" />
              </button>
              <button className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition">
                <Settings size={20} className="text-cafe-moyen" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {Object.entries(stats || {}).map(([key, value], i) => (
            !['byStatus', 'actorStats'].includes(key) && (
              <StatCard
                key={key}
                label={key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                value={String(value)}
                icon={i % 2 === 0 ? Package : CheckCircle2}
              />
            )
          ))}
        </motion.div>

        {/* Role-Specific Content */}
        {user?.role === 'Agriculteur' && (
          <div className="space-y-6">
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowForm(!showForm)}
              className="w-full py-4 bg-gradient-to-r from-cacao-vert to-cafe-moyen text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-105 transition"
            >
              <Plus size={24} />
              Ajouter un Nouveau Lot
            </motion.button>

            {showForm && (
              <GlassCard className="p-8">
                <h3 className="text-2xl font-bold mb-6">Créer un Nouveau Lot</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await api.addLot(formData);
                    await fetchDashboard();
                    setShowForm(false);
                    setFormData({});
                  } catch (err) {
                    alert('Erreur lors de la création du lot');
                  }
                }} className="space-y-4">
                  <input
                    type="number"
                    placeholder="Quantité (kg)"
                    value={formData.quantity || ''}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-cacao-dore/20 focus:ring-2 focus:ring-cacao-vert"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Origine"
                    value={formData.origin || ''}
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-cacao-dore/20 focus:ring-2 focus:ring-cacao-vert"
                    required
                  />
                  <input
                    type="text"
                    placeholder="GPS"
                    value={formData.gps || ''}
                    onChange={(e) => setFormData({...formData, gps: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-cacao-dore/20 focus:ring-2 focus:ring-cacao-vert"
                  />
                  <button type="submit" className="w-full py-3 bg-cacao-vert text-white rounded-xl font-bold hover:bg-cacao-vert/80">
                    Créer le Lot
                  </button>
                </form>
              </GlassCard>
            )}
          </div>
        )}

        {/* Lots List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
          <h2 className="text-2xl font-bold text-cafe-profondeur mb-4">Lots Disponibles</h2>
          {lots.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <p className="text-cafe-moyen">Aucun lot disponible</p>
            </GlassCard>
          ) : (
            lots.map((lot) => (
              <motion.div
                key={lot.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-6 rounded-2xl border border-cacao-dore/10 hover:border-cacao-vert/20 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-cafe-profondeur">{lot.id}</h3>
                    <p className="text-cafe-moyen text-sm">{lot.origin}</p>
                  </div>
                  <span className="px-4 py-2 bg-cacao-vert/10 text-cacao-vert rounded-full text-sm font-bold">
                    {lot.quantity} kg
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-cafe-clair uppercase">Producteur</p>
                    <p className="font-bold text-cafe-profondeur">{lot.producerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cafe-clair uppercase">Status</p>
                    <p className="font-bold text-cacao-vert">{['Enregistré', 'Reçu', 'Certifié', 'Transport', 'Transformé', 'Exporté'][lot.status]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cafe-clair uppercase">GPS</p>
                    <p className="font-bold text-cafe-profondeur text-xs">{lot.gps}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cafe-clair uppercase">Date</p>
                    <p className="font-bold text-cafe-profondeur text-sm">{new Date(lot.timestamp).toLocaleDateString('fr')}</p>
                  </div>
                </div>

                {/* Role-Specific Actions */}
                <div className="flex gap-3 flex-wrap">
                  {user?.role === 'Coopérative' && lot.status === 0 && (
                    <button
                      onClick={() => handleAction('receive', lot)}
                      className="px-4 py-2 bg-cacao-dore text-white rounded-xl font-bold hover:bg-cacao-dore/80 flex items-center gap-2"
                    >
                      <Package size={16} />
                      Recevoir le Lot
                    </button>
                  )}
                  {user?.role === 'Coopérative' && lot.status === 1 && (
                    <button
                      onClick={() => handleAction('certify', lot)}
                      className="px-4 py-2 bg-cacao-vert text-white rounded-xl font-bold hover:bg-cacao-vert/80 flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      Certifier la Qualité
                    </button>
                  )}
                  {user?.role === 'Transporteur' && lot.status === 2 && (
                    <button
                      onClick={() => handleAction('transport', lot)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 flex items-center gap-2"
                    >
                      <Truck size={16} />
                      Commencer Transport
                    </button>
                  )}
                  {user?.role === 'Transformateur' && lot.status === 3 && (
                    <button
                      onClick={() => handleAction('transform', lot)}
                      className="px-4 py-2 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 flex items-center gap-2"
                    >
                      <Zap size={16} />
                      Transformer
                    </button>
                  )}
                  {user?.role === 'Exportateur' && lot.status === 4 && (
                    <button
                      onClick={() => handleAction('export', lot)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 flex items-center gap-2"
                    >
                      <Globe size={16} />
                      Exporter
                    </button>
                  )}
                  {user?.role === 'Acheteur' && lot.status === 5 && (
                    <button
                      className="px-4 py-2 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      Vérifier l'Origine
                    </button>
                  )}
                </div>

                {/* Lot History */}
                {lot.history && lot.history.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-cacao-dore/10">
                    <p className="text-xs font-bold text-cafe-clair uppercase mb-2">Historique</p>
                    <div className="space-y-1">
                      {lot.history.map((h, i) => (
                        <div key={i} className="text-xs text-cafe-moyen">
                          <span className="font-bold">{h.label}</span> - {new Date(h.date).toLocaleDateString('fr')} par {h.actor}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Ministry Reports */}
        {user?.role === 'Ministère' && stats?.byStatus && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 size={24} className="text-cacao-vert" />
                Lots par Statut
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.byStatus).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-cafe-moyen">{key}</span>
                    <span className="font-bold text-cafe-profondeur">{value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
            {stats?.actorStats && (
              <GlassCard className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Users size={24} className="text-cacao-vert" />
                  Acteurs du Système
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.actorStats).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-cafe-moyen">{key}</span>
                      <span className="font-bold text-cafe-profondeur">{value}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
