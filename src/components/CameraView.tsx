import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CameraViewProps {
  onCapture: (base64: string) => void;
  isProcessing: boolean;
}

export function CameraView({ onCapture, isProcessing }: CameraViewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onCapture(base64.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="aspect-[4/3] bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center gap-4 p-8 text-slate-400 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-slate-900 transition-colors">
              <Camera className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">Scan Creature</p>
              <p className="text-sm">Upload or take a photo to identify</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-700"
          >
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-orange-400 animate-spin" />
                <div className="text-center">
                  <p className="text-orange-400 font-bold animate-pulse">ANALYZING BIOMETRICS...</p>
                  <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Accessing Global Database</p>
                </div>
              </div>
            )}

            {!isProcessing && (
              <button
                onClick={() => setPreview(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-slate-900/80 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
