import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/useThemeStore';

export function BackgroundVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const theme = useThemeStore((state) => state.theme);
    const isLight = theme === "light";

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.5;
            videoRef.current.play().catch(e => console.error("Video autoPlay failed:", e));
        }
    }, [isLight]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={isLight ? "light-video" : "dark-video"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="fixed inset-0 w-screen h-screen z-[-1] pointer-events-none overflow-hidden"
                style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: isLight
                            ? 'none'
                            : 'blur(0px) brightness(0.3) contrast(1.8)',
                    }}
                >
                    <source
                        src={isLight ? "/Untitled design.mp4" : "/Untitled design(1).mp4"}
                        type="video/mp4"
                    />
                </video>
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundRepeat: 'repeat' }}
                />
                {!isLight && <div className="absolute inset-0 bg-black/50" />}
            </motion.div>
        </AnimatePresence>
    );
}
