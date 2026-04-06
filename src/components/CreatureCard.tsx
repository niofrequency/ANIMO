import { motion } from 'motion/react';
import { Play, Shield, Zap, Target, Eye } from 'lucide-react';
import { CreatureInfo } from '../types';
import { StatsChart } from './StatsChart';
import { cn } from '../lib/utils';

interface CreatureCardProps {
  creature: CreatureInfo;
  imageUrl: string;
}

const rarityColors = {
  COMMON: 'bg-slate-500 text-white',
  UNCOMMON: 'bg-orange-500 text-white',
  RARE: 'bg-blue-500 text-white',
  EPIC: 'bg-purple-500 text-white',
  LEGENDARY: 'bg-yellow-500 text-black font-bold animate-pulse',
};

export function CreatureCard({ creature, imageUrl }: CreatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-700 shadow-2xl relative"
    >
      {/* Holographic Projection Area */}
      <div className="relative h-64 bg-gradient-to-b from-orange-900/20 to-slate-900 overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent)]" />
        
        {/* Animated Creature Image */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 1, -1, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-0 flex items-center justify-center p-8"
        >
          <div className="relative">
            <img
              src={imageUrl}
              alt={creature.commonName}
              className="w-48 h-48 object-contain rounded-full border-4 border-orange-400/30 shadow-[0_0_50px_rgba(249,115,22,0.3)]"
              referrerPolicy="no-referrer"
            />
            {/* Holographic Scan Lines Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_0%,rgba(249,115,22,0.1)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan" />
            <div className="absolute -inset-4 border border-orange-400/20 rounded-full animate-ping-slow" />
          </div>
        </motion.div>

        {/* Floating Particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
              x: Math.random() * 40 - 20
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute bottom-0 w-1 h-1 bg-orange-400 rounded-full"
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{creature.commonName}</h2>
            <p className="text-orange-400 font-mono text-sm italic">{creature.scientificName}</p>
          </div>
          <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest", rarityColors[creature.rarity])}>
            {creature.rarity}
          </span>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
          <p className="text-slate-300 text-sm leading-relaxed">
            <span className="text-orange-400 font-bold">Fact:</span> {creature.description}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 items-center">
          <StatsChart stats={creature.stats} />
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Target className="w-4 h-4 text-red-400" />
              <span>AGGRESSION: {creature.stats.aggression}/10</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Eye className="w-4 h-4 text-orange-400" />
              <span>CAMOUFLAGE: {creature.stats.camouflage}/10</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>SPEED: {creature.stats.speed}/10</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>DEFENSE: {creature.stats.defense}/10</span>
            </div>
          </div>
        </div>

        {/* YouTube Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Related Media</h3>
          <div className="grid grid-cols-2 gap-3">
            {creature.videos.map((video, idx) => (
              <a
                key={idx}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-video rounded-xl overflow-hidden border border-slate-700 hover:border-orange-400 transition-colors"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-[10px] font-bold text-white truncate">{video.title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* AR Button */}
        <button className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-slate-900 font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
          <Eye className="w-5 h-5" />
          VIEW IN AR
        </button>
      </div>
    </motion.div>
  );
}
