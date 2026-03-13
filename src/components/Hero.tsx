'use client';

import { useState, useEffect, useRef } from 'react';

// Slot items — 13 = 4 full cycles, last item is ARQ. (same visual as index 0)
const BADGE_ITEMS = [
    'ARQ.', 'EMP.', 'CEO.',
    'ARQ.', 'EMP.', 'CEO.',
    'ARQ.', 'EMP.', 'CEO.',
    'ARQ.', 'EMP.', 'CEO.',
    'ARQ.',
];

// Fixed item height matching CSS (.hero-float-slot-list li { height: 88px })
const BADGE_ITEM_H   = 88;
const BADGE_SCROLL   = 12 * BADGE_ITEM_H; // 1056px — lands on final ARQ.

// easeOutExpo: most convincing slot-machine deceleration
function easeOutExpo(t: number): number {
    return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

type Phase = 'idle' | 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'done';

export default function Hero() {
    const [phase, setPhase] = useState<Phase>('idle');

    const sectionRef     = useRef<HTMLElement>(null);
    const slotListRef    = useRef<HTMLUListElement>(null);
    const inlineBadgeRef = useRef<HTMLSpanElement>(null);
    const nameLineRef    = useRef<HTMLSpanElement>(null);

    const [badgeStyle, setBadgeStyle] = useState<React.CSSProperties>({
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        transition: 'none',
        willChange: 'transform',
    });

    // ── Start animation on mount ────────────────────────────────────────
    useEffect(() => {
        const t = setTimeout(() => setPhase('p1'), 300);
        return () => clearTimeout(t);
    }, []);

    // ── P1: JS-driven slot deceleration (easeOutExpo, 2.2 s) ─────────────
    useEffect(() => {
        if (phase !== 'p1') return;

        const slotList = slotListRef.current;
        if (!slotList) { setTimeout(() => setPhase('p2'), 2500); return; }

        const duration = 2200;
        let startTime: number | null = null;
        let rafId: number;

        const step = (ts: number) => {
            if (startTime === null) startTime = ts;
            const t = Math.min((ts - startTime) / duration, 1);
            slotList.style.transform = `translateY(-${easeOutExpo(t) * BADGE_SCROLL}px)`;
            if (t < 1) {
                rafId = requestAnimationFrame(step);
            } else {
                setTimeout(() => setPhase('p2'), 380); // brief pause on ARQ.
            }
        };
        rafId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafId);
    }, [phase]);

    // ── P2: sweep right + scale down (badge flies toward name) ───────────
    useEffect(() => {
        if (phase !== 'p2') return;

        const section  = sectionRef.current;
        const nameLine = nameLineRef.current;

        if (section && nameLine) {
            const sr = section.getBoundingClientRect();
            const nr = nameLine.getBoundingClientRect();
            // Target: past the right edge of "JUAN ANDRÉS" + gap
            const tx = nr.right + 80 - sr.left - sr.width  / 2;
            const ty = nr.top + nr.height / 2 - sr.top - sr.height / 2;

            setBadgeStyle(prev => ({
                ...prev,
                // Scale shrinks from 1 → 0.78 during flight
                transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.78)`,
                transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }));
        }

        const t = setTimeout(() => setPhase('p3'), 1300);
        return () => clearTimeout(t);
    }, [phase]);

    // ── P3: FLIP to exact inline superscript position ─────────────────────
    useEffect(() => {
        if (phase !== 'p3') return;

        const section     = sectionRef.current;
        const inlineBadge = inlineBadgeRef.current;

        if (section && inlineBadge) {
            const sr = section.getBoundingClientRect();
            const ir = inlineBadge.getBoundingClientRect();
            const tx = ir.left + ir.width  / 2 - sr.left - sr.width  / 2;
            const ty = ir.top  + ir.height / 2 - sr.top  - sr.height / 2;
            // Scale down from BADGE_ITEM_H to the inline badge's rendered height
            const scale = ir.height / BADGE_ITEM_H;

            setBadgeStyle(prev => ({
                ...prev,
                transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${scale})`,
                transition: 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1)',
            }));
        }

        const t = setTimeout(() => setPhase('p4'), 750);
        return () => clearTimeout(t);
    }, [phase]);

    // ── P4 → P5 → done ───────────────────────────────────────────────────
    useEffect(() => {
        if (phase !== 'p4') return;
        const t = setTimeout(() => setPhase('p5'), 500);
        return () => clearTimeout(t);
    }, [phase]);

    useEffect(() => {
        if (phase !== 'p5') return;
        const t = setTimeout(() => setPhase('done'), 1600);
        return () => clearTimeout(t);
    }, [phase]);

    const showFloat  = phase === 'p1' || phase === 'p2' || phase === 'p3';
    const showInline = phase === 'p4' || phase === 'p5' || phase === 'done';

    return (
        <section
            id="hero"
            ref={sectionRef}
            className={`hero-section bg-animated-gradient hero-phase-${phase}`}
        >
            {/* ── Floating badge: phases p1 / p2 / p3 ── */}
            {showFloat && (
                <div
                    className={`hero-float-badge hero-float-badge--${phase}`}
                    style={badgeStyle}
                >
                    <ul ref={slotListRef} className="hero-float-slot-list">
                        {BADGE_ITEMS.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="container hero-content">
                <div className="brand-lockup">
                    {/* Taglines — p5 */}
                    <div className="brand-left">
                        <span className={`brand-line-1 hero-tagline${phase === 'p5' || phase === 'done' ? ' hero-tagline--in hero-tagline--delay-0' : ''}`}>
                            CONSTRUYENDO
                        </span>
                        <span className={`brand-line-2 hero-tagline${phase === 'p5' || phase === 'done' ? ' hero-tagline--in hero-tagline--delay-1' : ''}`}>
                            FUTURO, CREANDO
                        </span>
                        <span className={`brand-line-3 hero-tagline${phase === 'p5' || phase === 'done' ? ' hero-tagline--in hero-tagline--delay-2' : ''}`}>
                            LEGADO.
                        </span>
                    </div>

                    {/* Divider — p4 */}
                    <div className={`brand-divider${
                        phase === 'p4' || phase === 'p5' || phase === 'done'
                            ? ' hero-divider--grow'
                            : ' hero-divider--hidden'
                    }`} />

                    {/* Name — wipes in at p2 */}
                    <div className="brand-right">
                        <h1 className={`hero-title-name${
                            phase === 'p2' || phase === 'p3' ? ' hero-name--reveal' :
                            phase === 'p4' || phase === 'p5' || phase === 'done' ? ' hero-name--visible' :
                            ' hero-name--hidden'
                        }`}>
                            <span ref={nameLineRef} className="hero-name-first">JUAN ANDRÉS</span>

                            {/* Inline slot badge — p4+ */}
                            <span
                                ref={inlineBadgeRef}
                                className={`brand-prefix slot-machine-container${
                                    showInline ? ' hero-inline-badge--show' : ' hero-inline-badge--hidden'
                                }`}
                                style={{ marginRight: 0, marginLeft: '0.3em' }}
                            >
                                <ul className="slot-machine-list">
                                    <li className="slot-accent">ARQ.</li>
                                    <li className="slot-accent">EMP.</li>
                                    <li className="slot-accent">CEO.</li>
                                    <li className="slot-accent">ARQ.</li>
                                </ul>
                            </span>

                            <br />ROMERO
                        </h1>
                    </div>
                </div>

                <div className={`hero-actions mt-5${
                    phase === 'done' ? ' hero-actions--show' : ' hero-actions--hidden'
                }`}>
                    <a href="#about" className="btn btn-primary">Conoce mi visión &rarr;</a>
                </div>
            </div>
        </section>
    );
}
