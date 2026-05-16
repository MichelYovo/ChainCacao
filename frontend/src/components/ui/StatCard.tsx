import React from 'react';
import { LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, colorClass = 'bg-cafe-profondeur' }) => {
  return (
    <GlassCard className="p-6 flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${colorClass} shadow-lg shrink-0`}>
        <Icon size={28} />
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cafe-clair leading-none mb-2">{title}</h4>
        <p className="text-3xl font-display font-bold tracking-tighter text-cafe-profondeur">{value}</p>
      </div>
    </GlassCard>
  );
};
