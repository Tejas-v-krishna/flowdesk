import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete,
                });
            },
        });

        gsap.set([textRef.current, logoRef.current], { opacity: 0, y: 20 });
        gsap.set(progressRef.current, { scaleX: 0 });

        tl.to(logoRef.current, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
            .to(textRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
            .to(
                { val: 0 },
                {
                    val: 100,
                    duration: 2,
                    ease: "none",
                    onUpdate: function () {
                        const p = Math.floor(this.targets()[0].val);
                        setPercent(p);
                        gsap.set(progressRef.current, { scaleX: p / 100 });
                    },
                },
                "-=0.3"
            )
            .to(containerRef.current, {
                backgroundColor: "rgba(5, 5, 8, 1)",
                duration: 0.5,
            });

        return () => {
            tl.kill();
        };
    }, [onComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050508] transition-colors duration-1000"
        >
            <div className="relative mb-12">
                <img
                    ref={logoRef}
                    src="/Group 5.svg"
                    alt="FlowDesk"
                    className="w-[300px] h-auto filter drop-"
                />
                <div className="absolute inset-0 bg-[#000000] opacity-10 blur-[60px] rounded-full scale-150 pointer-events-none" />
            </div>

            <div ref={textRef} className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center">
                    <span className="text-[#000000] text-[10px] tracking-[4px] font-bold uppercase mb-3">
                        INITIALIZING WORKSPACE
                    </span>
                    <div className="h-[2px] w-[200px] bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden relative">
                        <div
                            ref={progressRef}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#000000] to-[#ffffff] origin-left"
                            style={{ width: "100%" }}
                        />
                    </div>
                </div>

                <div className="flex items-baseline gap-2 tabular-nums">
                    <span className="text-white text-[14px] font-bold">{percent}%</span>
                    <span className="text-[rgba(255,255,255,0.2)] text-[10px] uppercase tracking-normal font-medium">
                        Loading...
                    </span>
                </div>
            </div>

            {/* Decorative side lines */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 h-[200px] w-[1px] bg-gradient-to-b from-transparent via-[rgba(120,76,254,0.2)] to-transparent" />
            <div className="absolute right-10 top-1/2 -translate-y-1/2 h-[200px] w-[1px] bg-gradient-to-b from-transparent via-[rgba(120,76,254,0.2)] to-transparent" />
        </div>
    );
}

