import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { CreatureStats } from '../types';

interface StatsChartProps {
  stats: CreatureStats;
}

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
  // Using CAMO to ensure the label fits comfortably, aligning with the UI below it
  const data = [
    { subject: 'AGGRESSION', value: stats.aggression, fullMark: 10 },
    { subject: 'CAMOUFLAGE', value: stats.camouflage, fullMark: 10 },
    { subject: 'SPEED', value: stats.speed, fullMark: 10 },
    { subject: 'DEFENSE', value: stats.defense, fullMark: 10 },
  ];

  return (
    <div className="w-full h-56"> 
      <ResponsiveContainer width="100%" height="100%">
        {/* Added Margin and reduced outerRadius to 65% so the text isn't cut off */}
        <RadarChart cx="50%" cy="50%" outerRadius="65%" margin={{ top: 10, right: 35, bottom: 10, left: 35 }} data={data}>
          <PolarGrid stroke="#fb923c" strokeOpacity={0.2} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
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
