import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendUp, icon: Icon, colorClass = "text-brand" }) => {
  return (
    <div className="bg-ink-900 border border-ink-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-ink-400 text-sm font-medium uppercase tracking-wider">{label}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
          {trend && (
            <div className={`flex items-center mt-2 text-xs font-medium ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
              <span>{trendUp ? '↑' : '↓'} {trend}</span>
              <span className="text-ink-500 ml-1">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-ink-800 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;