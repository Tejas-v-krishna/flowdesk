import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Music, CloudRain, Coffee, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

interface SoundLayer {
  id: string;
  name: string;
  icon: React.ElementType;
  url: string;
  volume: number;
  isActive: boolean;
}

const INITIAL_LAYERS: SoundLayer[] = [
  { id: 'lofi', name: 'Lofi Beats', icon: Music, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', volume: 0.5, isActive: false },
  { id: 'rain', name: 'Rainfall', icon: CloudRain, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', volume: 0.4, isActive: false },
  { id: 'cafe', name: 'Cafe Mood', icon: Coffee, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', volume: 0.3, isActive: false },
  { id: 'wind', name: 'Windy', icon: Wind, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', volume: 0.3, isActive: false },
];

export function AmbientMixer() {
  const [layers, setLayers] = useState<SoundLayer[]>(INITIAL_LAYERS);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const toggleLayer = (id: string) => {
    setLayers(prev => prev.map(l => {
      if (l.id === id) {
        const nextActive = !l.isActive;
        if (nextActive) {
          audioRefs.current[id]?.play().catch(() => {});
        } else {
          audioRefs.current[id]?.pause();
        }
        return { ...l, isActive: nextActive };
      }
      return l;
    }));
  };

  const updateVolume = (id: string, vol: number) => {
    setLayers(prev => prev.map(l => {
      if (l.id === id) {
        if (audioRefs.current[id]) {
          audioRefs.current[id].volume = vol;
        }
        return { ...l, volume: vol };
      }
      return l;
    }));
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      Object.values(audioRefs.current).forEach(audio => audio.pause());
    };
  }, []);

  return (
    <div className="w-full px-4 py-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4">
        <Volume2 size={16} className="text-primary" />
        <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">Ambient Mixer</span>
      </div>

      <div className="flex flex-col gap-4">
        {layers.map((layer) => (
          <div key={layer.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleLayer(layer.id)}
                  className={`p-1.5 rounded-2xl transition-all ${layer.isActive ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}`}
                >
                  <layer.icon size={14} />
                </button>
                <span className={`text-[12px] font-bold ${layer.isActive ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                  {layer.name}
                </span>
              </div>
              {layer.isActive && (
                <div className="flex gap-0.5">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 10, 4] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                      className="w-0.5 bg-primary rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>
            
            <audio
              ref={el => { if (el) audioRefs.current[layer.id] = el; }}
              src={layer.url}
              loop
            />

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={layer.volume}
              onChange={(e) => updateVolume(layer.id, parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
