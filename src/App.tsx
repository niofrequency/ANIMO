import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PawPrint, Trophy, History, Scan, Info, Camera } from 'lucide-react';
import { CreatureCard } from './components/CreatureCard';
import { CreatureInfo, CollectionItem } from './types';
import { identifyCreature } from './services/gemini';
import { cn } from './lib/utils';

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCreature, setCurrentCreature] = useState<CreatureInfo | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [view, setView] = useState<'scan' | 'collection'>('scan');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load collection from local storage
  useEffect(() => {
    const saved = localStorage.getItem('animo_collection');
    if (saved) {
      setCollection(JSON.parse(saved));
    }
  }, []);

  const saveToCollection = (creature: CreatureInfo, imageUrl: string) => {
    try {
      const newItem: CollectionItem = {
        id: crypto.randomUUID(),
        creature,
        capturedAt: new Date().toISOString(),
        imageUrl,
      };
      const updated = [newItem, ...collection];
      setCollection(updated);
      localStorage.setItem('animo_collection', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage full! Couldn't save to Pedia, but scan successful.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      handleCapture(base64String);
    };
    reader.readAsDataURL(file);
    
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCapture = async (base64: string) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setView('scan'); // Force view to scan tab if they scan from pedia
    
    try {
      const info = await identifyCreature(base64);
      const imageUrl = `data:image/jpeg;base64,${base64}`;
      setCurrentCreature(info);
      setCurrentImageUrl(imageUrl);
      saveToCollection(info, imageUrl);
    } catch (error) {
      console.error(error);
      alert("Identification failed. Please try again with a clearer photo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const collectionProgress = (collection.length / 150) * 100;

  const walkingPath = [
    { x: -25, y: 40, rotation: -20, isLeft: true },
    { x: 25, y: 20, rotation: 20, isLeft: false },
    { x: -20, y: -10, rotation: -15, isLeft: true },
    { x: 20, y: -30, rotation: 15, isLeft: false },
    { x: -15, y: -60, rotation: -10, isLeft: true },
    { x: 15, y: -80, rotation: 10, isLeft: false },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-slate-900 pb-24">
      {/* Hidden File Input - Removed capture="environment" so gallery works! */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleImageUpload}
        className="hidden" 
      />

      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
              <PawPrint className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">ANIMO</h1>
              <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">AI Bio-Scanner v2.5</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Collection Status</p>
              <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${collectionProgress}%` }}
                  className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" 
                />
              </div>
              <p className="text-[10px] text-orange-400 font-bold mt-1">{collection.length}/150 CAPTURED</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        <AnimatePresence mode="wait">
          {view === 'scan' ? (
            <motion.div
              key="scan-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              {!currentCreature ? (
                <div className="space-y-6 pt-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Identify Life</h2>
                    <p className="text-slate-400 text-sm">Tap the camera button below to scan a creature from your gallery or camera.</p>
                  </div>
                  
                  <div className="relative">
                    {/* Empty State Scanner UI */}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center bg-slate-900/50 cursor-pointer hover:border-orange-500/50 transition-colors group"
                    >
                      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="w-10 h-10 text-orange-500" />
                      </div>
                      <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Tap to Upload Photo</p>
                    </div>
                    
                    {/* Slow, Zig-Zag Walking Paw Processing Overlay */}
                    {isProcessing && (
                      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md rounded-3xl border border-orange-500/30 overflow-hidden">
                        <div className="relative w-32 h-32 mt-12">
                          {walkingPath.map((step, i) => (
                            <div
                              key={i}
                              className="absolute left-1/2 top-1/2 -ml-4 -mt-4"
                              style={{
                                transform: `translate(${step.x}px, ${step.y}px) rotate(${step.rotation}deg)`,
                              }}
                            >
                              <div 
                                className="animate-paw-fade opacity-0"
                                style={{ animationDelay: `${i * 0.4}s` }}
                              >
                                <PawPrint 
                                  className="w-8 h-8 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" 
                                  style={{ transform: step.isLeft ? 'scaleX(-1)' : 'scaleX(1)' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="mt-6 flex flex-col items-center gap-1 z-10"
                        >
                          <p className="text-orange-500 font-bold uppercase tracking-[0.3em] text-sm">Tracking</p>
                          <p className="text-slate-400 text-xs">Following biological trail...</p>
                        </motion.div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Rarity Found</p>
                        <p className="text-sm font-bold text-white">Epic: 2</p>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
                      <Info className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Scanner Level</p>
                        <p className="text-sm font-bold text-white">Level 12</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <CreatureCard creature={currentCreature} imageUrl={currentImageUrl!} />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="collection-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">My Collection</h2>
                <p className="text-orange-400 font-bold text-sm">{collection.length} Entries</p>
              </div>

              {collection.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-700">
                    <PawPrint className="w-10 h-10" />
                  </div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No entries found in database</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-orange-500 text-slate-900 font-bold rounded-xl hover:bg-orange-400 transition-colors"
                  >
                    START SCANNING
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {collection.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setCurrentCreature(item.creature);
                        setCurrentImageUrl(item.imageUrl);
                        setView('scan');
                      }}
                      className="bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-800 cursor-pointer group"
                    >
                      <div className="aspect-square relative">
                        <img 
                          src={item.imageUrl} 
                          alt={item.creature.commonName} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">{item.creature.rarity}</p>
                          <p className="text-xs font-bold text-white truncate">{item.creature.commonName}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar - Fixed alignment so the button sits inline! */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-3xl p-3 flex items-center justify-between px-8 shadow-2xl z-50">
        
        {/* Left Nav Item */}
        <button
          onClick={() => {
             setView('scan');
             if (view === 'scan') {
               setCurrentCreature(null);
               setCurrentImageUrl(null);
             }
          }}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            view === 'scan' ? "text-orange-500" : "text-slate-500 hover:text-white"
          )}
        >
          <Scan className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">View</span>
        </button>
        
        {/* Central Scan Button - Now sits perfectly inline! */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] active:scale-95 transition-transform"
        >
          <Camera className="w-7 h-7 text-slate-900 fill-slate-900" />
        </button>
        
        {/* Right Nav Item */}
        <button
          onClick={() => setView('collection')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            view === 'collection' ? "text-orange-500" : "text-slate-500 hover:text-white"
          )}
        >
          <History className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Pedia</span>
        </button>
      </nav>

      <style>{`
        @keyframes pawFade {
          0% { opacity: 0; transform: scale(0.8) translateY(10px); }
          15% { opacity: 1; transform: scale(1.1) translateY(0); }
          40% { opacity: 0; transform: scale(0.9) translateY(-10px); }
          100% { opacity: 0; transform: scale(0.8); }
        }
        .animate-paw-fade {
          animation: pawFade 2.4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
