import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { CreatureStats } from '../types';

interface StatsChartProps {
  stats: CreatureStats;
}

// Custom Tooltip for the Radar Chart to match the UI theme
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-orange-500/50 p-2 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">
          {payload[0].payload.subject}
        </p>
        <p className="text-sm font-black text-white">
          Level: {payload[0].value}/10
        </p>
      </div>
    );
  }
  return null;
};

export function StatsChart({ stats }: StatsChartProps) {
  const data = [
    { subject: 'AGGRESSION', value: stats.aggression, fullMark: 10 },
    { subject: 'CAMOUFLAGE', value: stats.camouflage, fullMark: 10 },
    { subject: 'SPEED', value: stats.speed, fullMark: 10 },
    { subject: 'DEFENSE', value: stats.defense, fullMark: 10 },
  ];

  return (
    <div className="w-full h-48 -ml-4"> {/* Slight negative margin to better center the chart in the grid */}
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#fb923c" strokeOpacity={0.2} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Stats"
            dataKey="value"
            stroke="#fb923c"
            strokeWidth={2}
            fill="#fb923c"
            fillOpacity={0.4}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
