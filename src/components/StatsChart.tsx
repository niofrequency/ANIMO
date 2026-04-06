import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { CreatureStats } from '../types';

interface StatsChartProps {
  stats: CreatureStats;
}

export function StatsChart({ stats }: StatsChartProps) {
  const data = [
    { subject: 'AGGRESSION', value: stats.aggression, fullMark: 10 },
    { subject: 'CAMOUFLAGE', value: stats.camouflage, fullMark: 10 },
    { subject: 'SPEED', value: stats.speed, fullMark: 10 },
    { subject: 'DEFENSE', value: stats.defense, fullMark: 10 },
  ];

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#fb923c" strokeOpacity={0.2} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
          />
          <Radar
            name="Stats"
            dataKey="value"
            stroke="#fb923c"
            fill="#fb923c"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
