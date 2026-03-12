'use client';

import { useState, useEffect, useRef } from 'react';

// 10 irregular polygon fragments for the shatter effect
const FRAGMENTS = [
    { clip: 'polygon(0% 0%, 48% 0%, 36% 48%, 0% 38%)',              dx: -220, dy: -190, r: -26, delay: 0  },
    { clip: 'polygon(48% 0%, 100% 0%, 100% 42%, 62% 52%, 36% 48%)', dx:  210, dy: -195, r:  21, delay: 18 },
    { clip: 'polygon(0% 38%, 36% 48%, 22% 72%, 0% 62%)',             dx: -240, dy:   20, r: -34, delay: 38 },
    { clip: 'polygon(36% 48%, 62% 52%, 56% 70%, 38% 66%)',           dx:    5, dy: -115, r:  13, delay: 8  },
    { clip: 'polygon(62% 52%, 100% 42%, 100% 72%, 74% 76%)',         dx:  245, dy:   15, r:  30, delay: 28 },
    { clip: 'polygon(0% 62%, 22% 72%, 36% 88%, 0% 100%)',            dx: -215, dy:  200, r:  32, delay: 48 },
    { clip: 'polygon(38% 66%, 56% 70%, 68% 100%, 18% 100%)',         dx:  -15, dy:  225, r: -16, delay: 14 },
    { clip: 'polygon(74% 76%, 100% 72%, 100% 100%, 68% 100%)',       dx:  205, dy:  205, r: -24, delay: 33 },
    { clip: 'polygon(22% 72%, 38% 66%, 36% 88%)',                    dx: -155, dy:  145, r:  20, delay: 24 },
    { clip: 'polygon(56% 70%, 74% 76%, 68% 100%)',                   dx:  135, dy:  155, r: -16, delay: 44 },
] as const;

type Phase = 'spinning' | 'shatter' | 'exit' | 'done';

function SlotContent() {
    return (
        <>
            <div className="intro-slot-container">
                <ul className="intro-slot-list">
                    <li>ARQ.</li>
                    <li>EMP.</li>
                    <li>CEO.</li>
                    <li>ARQ.</li>
                </ul>
            </div>
            <p className="intro-name--full">JUAN ANDRÉS ROMERO</p>
        </>
    );
}

export default function IntroScreen() {
    const [phase, setPhase] = useState<Phase>('spinning');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef(0);
    const speedRef = useRef(0.4);
    const offsetRef = useRef(0);
    const didShatterRef = useRef(false);

    // JS-driven accelerating slot machine animation
    useEffect(() => {
        if (phase !== 'spinning') return;

        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const step = () => {
            if (didShatterRef.current) return;

            speedRef.current = Math.min(speedRef.current * 1.018, 100);

            const firstLi = wrapper.querySelector<HTMLElement>('.intro-slot-list li');
            const itemH = firstLi?.offsetHeight ?? 64;
            const cycle = itemH * 3;

            offsetRef.current = (offsetRef.current + speedRef.current) % cycle;
            wrapper.style.setProperty('--slot-offset', `-${offsetRef.current}px`);

            // Progressive vibration building with speed
            const wobbleMag = Math.max(0, (speedRef.current - 10) / 90) * 14;
            if (wobbleMag > 0.1) {
                const wx = (Math.random() - 0.5) * wobbleMag;
                const wy = (Math.random() - 0.5) * wobbleMag * 0.4;
                wrapper.style.transform = `translate(${wx}px, ${wy}px)`;
            }

            if (speedRef.current >= 95) {
                didShatterRef.current = true;
                wrapper.style.transform = '';
                setPhase('shatter');
                return;
            }

            rafRef.current = requestAnimationFrame(step);
        };

        const startId = setTimeout(() => {
            rafRef.current = requestAnimationFrame(step);
        }, 80);

        return () => {
            clearTimeout(startId);
            cancelAnimationFrame(rafRef.current);
        };
    }, [phase]);

    // Shatter → exit → done
    useEffect(() => {
        if (phase !== 'shatter') return;
        const t1 = setTimeout(() => setPhase('exit'), 250);
        const t2 = setTimeout(() => setPhase('done'), 2100);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [phase]);

    if (phase === 'done') return null;

    const breaking = phase === 'shatter' || phase === 'exit';

    return (
        <div className={`intro-overlay${phase === 'exit' ? ' intro-overlay--exit' : ''}`}>
            <div
                ref={wrapperRef}
                className={`intro-box-wrapper${breaking ? ' intro-box-wrapper--shatter' : ''}`}
            >
                {/* Single content layer — visible during spinning, hidden when shattering */}
                {!breaking && (
                    <div className="intro-main-content">
                        <SlotContent />
                    </div>
                )}

                {/* Fragments — only rendered when breaking */}
                {breaking && FRAGMENTS.map((frag, i) => (
                    <div
                        key={i}
                        className="intro-shard intro-shard--fly"
                        style={{
                            clipPath: frag.clip,
                            '--dx': `${frag.dx}px`,
                            '--dy': `${frag.dy}px`,
                            '--r': `${frag.r}deg`,
                            animationDelay: `${frag.delay}ms`,
                        } as React.CSSProperties}
                    >
                        <div className="intro-shard-content">
                            <SlotContent />
                        </div>
                    </div>
                ))}

                <div className={`intro-flash${breaking ? ' intro-flash--active' : ''}`} />
            </div>
        </div>
    );
}
