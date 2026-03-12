'use client';

import { useState, useEffect, useRef } from 'react';

type Phase = 'spinning' | 'exit' | 'done';

export default function IntroScreen() {
    const [phase, setPhase] = useState<Phase>('spinning');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const slotListRef = useRef<HTMLUListElement>(null);
    const rafRef = useRef(0);
    const speedRef = useRef(0.4);
    const offsetRef = useRef(0);
    const didExitRef = useRef(false);

    // JS-driven accelerating slot machine
    useEffect(() => {
        if (phase !== 'spinning') return;

        const wrapper = wrapperRef.current;
        const slotList = slotListRef.current;
        if (!wrapper || !slotList) return;

        const step = () => {
            if (didExitRef.current) return;

            speedRef.current = Math.min(speedRef.current * 1.018, 100);

            const itemH = slotList.children[0]
                ? (slotList.children[0] as HTMLElement).offsetHeight
                : 64;
            const cycle = itemH * 3;

            offsetRef.current = (offsetRef.current + speedRef.current) % cycle;
            slotList.style.transform = `translateY(-${offsetRef.current}px)`;

            // Vibration builds progressively with speed
            const wobble = Math.max(0, (speedRef.current - 10) / 90) * 14;
            if (wobble > 0.1) {
                const wx = (Math.random() - 0.5) * wobble;
                const wy = (Math.random() - 0.5) * wobble * 0.4;
                wrapper.style.transform = `translate(${wx}px, ${wy}px)`;
            }

            if (speedRef.current >= 95) {
                didExitRef.current = true;
                wrapper.style.transform = '';
                setPhase('exit');
                window.dispatchEvent(new CustomEvent('intro-complete'));
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

    // exit → done
    useEffect(() => {
        if (phase !== 'exit') return;
        const t = setTimeout(() => setPhase('done'), 1800);
        return () => clearTimeout(t);
    }, [phase]);

    if (phase === 'done') return null;

    return (
        <div className={`intro-overlay${phase === 'exit' ? ' intro-overlay--exit' : ''}`}>
            <div
                ref={wrapperRef}
                className={`intro-box-wrapper${phase === 'exit' ? ' intro-box-wrapper--exit' : ''}`}
            >
                <div className="intro-main-content">
                    <div className="intro-slot-container">
                        <ul ref={slotListRef} className="intro-slot-list">
                            <li>ARQ.</li>
                            <li>EMP.</li>
                            <li>CEO.</li>
                        </ul>
                    </div>
                    <p className="intro-name--full">JUAN ANDRÉS ROMERO</p>
                </div>

                <div className={`intro-flash${phase === 'exit' ? ' intro-flash--active' : ''}`} />
            </div>
        </div>
    );
}
