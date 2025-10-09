// src/components/admin/dashboard/EstadisticasRapidas.tsx
// Cards de estadísticas rápidas

import { LucideIcon } from 'lucide-react';

interface Stat {
  name: string;
  value: string | number;
  icon: LucideIcon;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral' | 'warning';
}

interface EstadisticasRapidasProps {
  stats: Stat[];
}

export default function EstadisticasRapidas({ stats }: EstadisticasRapidasProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="relative bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`
                    rounded-md p-3
                    ${stat.changeType === 'positive' ? 'bg-green-100' : ''}
                    ${stat.changeType === 'negative' ? 'bg-red-100' : ''}
                    ${stat.changeType === 'warning' ? 'bg-amber-100' : ''}
                    ${stat.changeType === 'neutral' ? 'bg-primary-100' : ''}
                  `}>
                    <Icon className={`
                      h-6 w-6
                      ${stat.changeType === 'positive' ? 'text-green-600' : ''}
                      ${stat.changeType === 'negative' ? 'text-red-600' : ''}
                      ${stat.changeType === 'warning' ? 'text-amber-600' : ''}
                      ${stat.changeType === 'neutral' ? 'text-primary-600' : ''}
                    `} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-neutral-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-neutral-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-neutral-50 px-5 py-3">
              <div className="text-sm">
                <span className={`
                  font-medium
                  ${stat.changeType === 'positive' ? 'text-green-600' : ''}
                  ${stat.changeType === 'negative' ? 'text-red-600' : ''}
                  ${stat.changeType === 'warning' ? 'text-amber-600' : ''}
                  ${stat.changeType === 'neutral' ? 'text-neutral-600' : ''}
                `}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}