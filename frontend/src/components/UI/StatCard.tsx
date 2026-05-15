import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  colorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, subtext, colorClass }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass p-6 flex flex-col gap-4 overflow-hidden relative"
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 bg-current ${colorClass}`} />
      
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10`}>
          <Icon className={colorClass.replace('bg-', 'text-')} size={24} />
        </div>
      </div>
      
      <div>
        <p className="text-cafe-moyen text-sm font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-display font-bold text-cafe-profondeur mt-1">{value}</h3>
        {subtext && <p className="text-xs text-cafe-clair mt-2 font-medium">{subtext}</p>}
      </div>
    </motion.div>
  );
};
