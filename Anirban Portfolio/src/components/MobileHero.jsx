import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────
   Animated perspective grid drawn on <canvas>
   ───────────────────────────────────────────────────────────────── */
function GridCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let raf;
        let t = 0;

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            const W = canvas.offsetWidth;
            const H = canvas.offsetHeight;
            ctx.clearRect(0, 0, W, H);

            t += 0.004;

            // ── Perspective grid ──────────────────────────────────────
            const vx = W / 2;
            const vy = H * 0.52;      // horizon a bit below center
            const cols = 14;
            const rows = 10;
            const spread = W * 1.6;
            const depth = H * 0.55;
            const speed = (t % 1);    // 0→1 looping scroll

            ctx.lineWidth = 0.6;

            // Vertical lines radiating from vanishing point
            for (let i = 0; i <= cols; i++) {
                const frac = i / cols;
                const bx = vx - spread / 2 + frac * spread; // base X on bottom
                const pulse = 0.06 + 0.06 * Math.sin(t * 2 + frac * Math.PI);
                ctx.strokeStyle = `rgba(255,255,255,${pulse})`;
                ctx.beginPath();
                ctx.moveTo(vx, vy);
                ctx.lineTo(bx, vy + depth);
                ctx.stroke();
            }

            // Horizontal lines (depth bands that scroll toward viewer)
            for (let j = 0; j <= rows; j++) {
                const frac = ((j / rows) + speed) % 1;
                // perspective interpolation
                const y = vy + frac * depth;
                const xScale = frac;
                const x0 = vx - (spread / 2) * xScale;
                const x1 = vx + (spread / 2) * xScale;
                const pulse = 0.04 + 0.08 * frac + 0.03 * Math.sin(t * 3 + j);
                ctx.strokeStyle = `rgba(255,255,255,${pulse})`;
                ctx.beginPath();
                ctx.moveTo(x0, y);
                ctx.lineTo(x1, y);
                ctx.stroke();
            }

            // Glowing horizon line
            const horizGrad = ctx.createLinearGradient(0, vy, W, vy);
            horizGrad.addColorStop(0, 'rgba(255,255,255,0)');
            horizGrad.addColorStop(0.5, `rgba(255,255,255,${0.12 + 0.06 * Math.sin(t)})`);
            horizGrad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.strokeStyle = horizGrad;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, vy);
            ctx.lineTo(W, vy);
            ctx.stroke();

            // Radial vignette overlay (top half only)
            const vig = ctx.createRadialGradient(vx, vy, 0, vx, vy, W * 0.9);
            vig.addColorStop(0, 'rgba(0,0,0,0)');
            vig.addColorStop(1, 'rgba(0,0,0,0.55)');
            ctx.fillStyle = vig;
            ctx.fillRect(0, 0, W, H);

            raf = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
        />
    );
}

/* ─────────────────────────────────────────────────────────────────
   Rotating orbital rings (SVG)
   ───────────────────────────────────────────────────────────────── */
function OrbitalRings() {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
            <div style={{ position: 'relative', width: 280, height: 280 }}>
                {/* Outermost slow ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', inset: 0 }}
                >
                    <svg viewBox="0 0 280 280" style={{ width: '100%', height: '100%' }}>
                        <circle cx="140" cy="140" r="132" fill="none"
                            stroke="rgba(255,255,255,0.06)" strokeWidth="1"
                            strokeDasharray="8 18" />
                        {/* tick marks */}
                        {[0, 90, 180, 270].map(deg => {
                            const r = 132;
                            const rad = (deg - 90) * Math.PI / 180;
                            const x1 = 140 + r * Math.cos(rad);
                            const y1 = 140 + r * Math.sin(rad);
                            const x2 = 140 + (r - 10) * Math.cos(rad);
                            const y2 = 140 + (r - 10) * Math.sin(rad);
                            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />;
                        })}
                    </svg>
                </motion.div>

                {/* Middle ring — counter-rotate */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', inset: 30 }}
                >
                    <svg viewBox="0 0 220 220" style={{ width: '100%', height: '100%' }}>
                        <circle cx="110" cy="110" r="102" fill="none"
                            stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"
                            strokeDasharray="2 12" />
                        {/* bright dot on the ring */}
                        <circle cx="110" cy="8" r="3"
                            fill="rgba(255,255,255,0.7)" />
                    </svg>
                </motion.div>

                {/* Inner ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', inset: 72 }}
                >
                    <svg viewBox="0 0 136 136" style={{ width: '100%', height: '100%' }}>
                        <circle cx="68" cy="68" r="60" fill="none"
                            stroke="rgba(255,255,255,0.1)" strokeWidth="1"
                            strokeDasharray="4 8" />
                        <circle cx="68" cy="8" r="2.5"
                            fill="rgba(255,255,255,0.9)" />
                    </svg>
                </motion.div>

                {/* Pulsing core */}
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.7, 0.35] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: 'white',
                        boxShadow: '0 0 12px 4px rgba(255,255,255,0.4)',
                    }} />
                </motion.div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Glitch text — flickers and shifts horizontally on a cycle
   ───────────────────────────────────────────────────────────────── */
function GlitchName({ text }) {
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
        const trigger = () => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 180);
        };
        const id = setInterval(trigger, 3400 + Math.random() * 1200);
        return () => clearInterval(id);
    }, []);

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Base text */}
            <span style={{
                fontFamily: 'inherit',
                fontSize: 'inherit',
                lineHeight: 'inherit',
                letterSpacing: 'inherit',
                color: 'white',
                textTransform: 'uppercase',
                position: 'relative',
                zIndex: 3,
            }}>
                {text}
            </span>

            {/* Glitch red channel */}
            {glitch && (
                <span style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    lineHeight: 'inherit',
                    letterSpacing: 'inherit',
                    textTransform: 'uppercase',
                    color: 'rgba(255,60,60,0.7)',
                    transform: 'translateX(-3px)',
                    zIndex: 2,
                    userSelect: 'none',
                    mixBlendMode: 'screen',
                }}>
                    {text}
                </span>
            )}
            {/* Glitch blue channel */}
            {glitch && (
                <span style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    lineHeight: 'inherit',
                    letterSpacing: 'inherit',
                    textTransform: 'uppercase',
                    color: 'rgba(60,200,255,0.6)',
                    transform: 'translateX(3px)',
                    zIndex: 2,
                    userSelect: 'none',
                    mixBlendMode: 'screen',
                }}>
                    {text}
                </span>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Scan sweep — a horizontal bright line that sweeps top→bottom
   ───────────────────────────────────────────────────────────────── */
function ScanSweep() {
    return (
        <motion.div
            initial={{ top: '-4%' }}
            animate={{ top: '104%' }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
            style={{
                position: 'absolute',
                left: 0, right: 0,
                height: 2,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.18) 70%, transparent)',
                pointerEvents: 'none',
                zIndex: 10,
            }}
        />
    );
}

/* ─────────────────────────────────────────────────────────────────
   Corner HUD bracket + label
   ───────────────────────────────────────────────────────────────── */
function Corner({ pos, label, sublabel }) {
    const isTop = pos.includes('top');
    const isLeft = pos.includes('left');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{
                position: 'absolute',
                ...(isTop ? { top: 52 } : { bottom: 24 }),
                ...(isLeft ? { left: 16 } : { right: 16 }),
                zIndex: 20,
                pointerEvents: 'none',
            }}
        >
            {/* bracket */}
            <div style={{
                width: 24, height: 24,
                borderTop: isTop ? '1.5px solid rgba(255,255,255,0.55)' : 'none',
                borderBottom: !isTop ? '1.5px solid rgba(255,255,255,0.55)' : 'none',
                borderLeft: isLeft ? '1.5px solid rgba(255,255,255,0.55)' : 'none',
                borderRight: !isLeft ? '1.5px solid rgba(255,255,255,0.55)' : 'none',
            }} />
            {/* label */}
            {label && (
                <div style={{
                    marginTop: isTop ? 4 : 0,
                    marginBottom: !isTop ? 4 : 0,
                    textAlign: isLeft ? 'left' : 'right',
                }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{label}</div>
                    {sublabel && <div style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>{sublabel}</div>}
                </div>
            )}
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Main MobileHero export
   ───────────────────────────────────────────────────────────────── */
const roles = ['Engineer.', 'Designer.', 'Creator.', 'Thinker.', 'Philosopher.', 'Writer.', 'Storyteller.', 'Explorer.', 'Knowledge Seeker.'];

export default function MobileHero({ time }) {
    const [roleIndex, setRoleIndex] = useState(0);
    const [bootLine, setBootLine] = useState(0);

    const bootSequence = [
        'BOOT  ████████████  100%',
        'INIT PORTFOLIO v2.0',
        'SYS READY ▮',
    ];

    useEffect(() => {
        const id = setInterval(() => setRoleIndex(i => (i + 1) % roles.length), 2200);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        let i = 0;
        const go = () => {
            if (i < bootSequence.length - 1) {
                i++;
                setBootLine(i);
                setTimeout(go, 600);
            }
        };
        setTimeout(go, 400);
    }, []);

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        }}>
            {/* ── Layer 0: Perspective grid canvas ── */}
            <GridCanvas />

            {/* ── Layer 1: Dot-grid texture ── */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
            }} />

            {/* ── Layer 2: Scanlines ── */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
                background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.018) 3px, rgba(255,255,255,0.018) 4px)',
            }} />

            {/* ── Scan sweep ── */}
            <ScanSweep />

            {/* ── Orbital rings (centred) ── */}
            <OrbitalRings />

            {/* Corner HUD brackets removed for cleaner, centered mobile layout */}

            {/* ── Boot terminal line (top centre) ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                    position: 'absolute', top: 58, left: 0, right: 0,
                    textAlign: 'center', zIndex: 20, pointerEvents: 'none',
                }}
            >
                <span style={{
                    fontFamily: 'monospace', fontSize: 9,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.38)',
                }}>
                    {bootSequence[bootLine]}
                </span>
            </motion.div>

            {/* ── Vertical side labels ── */}
            <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.7 }}
                style={{
                    position: 'absolute', left: 16, top: '50%',
                    transform: 'translateY(-50%) rotate(180deg)',
                    writingMode: 'vertical-rl', textOrientation: 'mixed',
                    zIndex: 20, pointerEvents: 'none',
                }}
            >
                <span style={{
                    fontFamily: 'monospace', fontSize: 8,
                    letterSpacing: '0.35em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.2)',
                }}>PORTFOLIO · ANIRBAN</span>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.7 }}
                style={{
                    position: 'absolute', right: 16, top: '50%',
                    transform: 'translateY(-50%)',
                    writingMode: 'vertical-rl', textOrientation: 'mixed',
                    zIndex: 20, pointerEvents: 'none',
                }}
            >
                <span style={{
                    fontFamily: 'monospace', fontSize: 8,
                    letterSpacing: '0.35em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.2)',
                }}>ROY · ENGINEER</span>
            </motion.div>

            {/* ── Main content block ── */}
            <div style={{
                position: 'relative', zIndex: 15,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', padding: '0 28px',
                gap: 0,
            }}>
                {/* Eyebrow label */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    style={{ marginBottom: 18 }}
                >
                    <span style={{
                        fontFamily: 'monospace', fontSize: 10,
                        letterSpacing: '0.28em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.45)',
                        borderBottom: '1px solid rgba(255,255,255,0.15)',
                        paddingBottom: 4,
                    }}>
                        ↗ ANIRBAN ROY ↗
                    </span>
                </motion.div>

                {/* Giant name with glitch */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.88, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        fontFamily: '"Bebas Neue", "Impact", "Anton", sans-serif',
                        fontSize: 'clamp(68px, 22vw, 96px)',
                        lineHeight: 0.9,
                        letterSpacing: '-0.02em',
                        fontWeight: 900,
                        marginBottom: 24,
                    }}
                >
                    <GlitchName text="Anirban" />
                    <br />
                    <div style={{ transform: 'translateX(3.2%)' }}>
                        <GlitchName text="Roy" />
                        <span className="dot-blink" style={{ color: 'white', marginLeft: '4px' }}>
                            .
                        </span>
                    </div>
                </motion.div>

                {/* Role tag */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    style={{
                        fontFamily: 'monospace',
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.75)',
                        letterSpacing: '0.08em',
                        display: 'flex', alignItems: 'center', gap: 8,
                        userSelect: 'none',
                    }}
                >
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>[</span>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={roleIndex}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.35 }}
                            style={{ color: 'rgba(255,255,255,0.95)', minWidth: 100, display: 'inline-block', textAlign: 'center' }}
                        >
                            {roles[roleIndex]}
                        </motion.span>
                    </AnimatePresence>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>]</span>
                </motion.div>

                {/* Horizontal divider with tick marks */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    style={{
                        marginTop: 28,
                        width: '100%', maxWidth: 220,
                        height: 1,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 30%, rgba(255,255,255,0.35) 70%, transparent)',
                        position: 'relative',
                    }}
                >
                    {/* centre pip */}
                    <div style={{
                        position: 'absolute', top: -2, left: '50%',
                        width: 5, height: 5, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.6)',
                        transform: 'translateX(-50%)',
                    }} />
                </motion.div>

                {/* Stat row */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.7, duration: 0.7 }}
                    style={{
                        marginTop: 20,
                        display: 'flex', gap: 28,
                        fontFamily: 'monospace',
                    }}
                >
                    {[['03+', 'YEARS'], ['12+', 'PROJECTS'], ['∞', 'IDEAS']].map(([val, lbl]) => (
                        <div key={lbl} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.04em' }}>{val}</div>
                            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 2 }}>{lbl}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ── Local Time HUD ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 16,
                    fontFamily: 'monospace',
                    fontSize: 8,
                    color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.12em',
                    zIndex: 20,
                    pointerEvents: 'none',
                }}
            >
                LOCAL TIME — {time}
            </motion.div>
        </div>
    );
}
