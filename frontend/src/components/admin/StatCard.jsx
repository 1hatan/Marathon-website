import React from 'react';

export default function StatCard({ title, value, icon: Icon, subtitle, color = 'yellow' }) {
  const colorMap = {
    yellow: 'bg-rock-yellow text-black border-amber-300',
    orange: 'bg-rock-yellow text-black border-amber-300',
    blue: 'bg-rock-cyan text-white border-sky-400',
    cyan: 'bg-rock-cyan text-white border-sky-400',
    green: 'bg-emerald-500 text-white border-emerald-400',
    black: 'bg-black text-white border-gray-900',
    purple: 'bg-black text-white border-gray-900',
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 hover:border-black transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-outfit mb-1">{title}</p>
          <h3 className="text-3xl font-black text-black font-outfit tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 font-medium mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${colorMap[color] || colorMap.yellow}`}>
            <Icon className="w-6 h-6 stroke-[2.5]" />
          </div>
        )}
      </div>
    </div>
  );
}

