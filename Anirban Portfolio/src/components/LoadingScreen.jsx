import { useEffect, useRef, useState } from 'react';

// ── Boot sequence lines ─────────────────────────────────────────────
const BOOT_LINES = [
    { text: 'SYSTEM INIT ................. [OK]', delay: 0 },
    { text: 'KERNEL LOAD ................. [OK]', delay: 200 },
    { text: 'MOUNTING VOLUMES ............ [OK]', delay: 400 },
    { text: 'ENV CHECK ................... [OK]', delay: 580 },
    { text: 'LOADING ASSETS .............. [OK]', delay: 760 },
    { text: 'SPLINE ENGINE READY ......... [OK]', delay: 940 },
    { text: 'AUDIO SUBSYSTEM ............. [OK]', delay: 1120 },
    { text: 'NEURAL RENDERER ............. [OK]', delay: 1300 },
    { text: 'PORTFOLIO_CORE v2.0.4 ....... [READY]', delay: 1500 },
];

// ── B&W Matrix rain ─────────────────────────────────────────────────
function MatrixRain() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const SZ = 13;
        const CHARS = '01アイウエオカキクサシスセタチツナニヌABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let drops = [];
        let animId;

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const cols = Math.floor(canvas.width / SZ);
            drops = Array.from({ length: cols }, () =>
                (Math.random() * -canvas.height) / SZ
            );
        }

        function draw() {
            // Black fade trail
            ctx.fillStyle = 'rgba(0,0,0,0.12)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${SZ}px 'IBM Plex Mono', monospace`;

            for (let i = 0; i < drops.length; i++) {
                const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
                const y = drops[i] * SZ;

                if (y > 0 && y < canvas.height) {
                    const r = Math.random();
                    // Bright white head, dimmer grey body
                    ctx.fillStyle = r > 0.92
                        ? 'rgba(255,255,255,0.95)'
                        : `rgba(180,180,180,${0.06 + r * 0.12})`;
                    ctx.fillText(ch, i * SZ, y);
                }

                if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i] += 0.35;
            }
            animId = requestAnimationFrame(draw);
        }

        resize();
        window.addEventListener('resize', resize);
        animId = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none',
                opacity: 0.6,
            }}
        />
    );
}

// ── Blinking block cursor ───────────────────────────────────────────
function Cursor() {
    const [on, setOn] = useState(true);
    useEffect(() => {
        const id = setInterval(() => setOn(v => !v), 530);
        return () => clearInterval(id);
    }, []);
    return <span style={{ opacity: on ? 1 : 0, marginLeft: 3 }}>_</span>;
}

// ── B&W CSS progress bar ────────────────────────────────────────────
function ProgressBar({ pct }) {
    const safe = isNaN(pct) ? 0 : Math.max(0, Math.min(100, pct));
    const label = String(Math.round(safe)).padStart(3, ' ');

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>[</span>
            <div
                style={{
                    flex: 1,
                    height: 3,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 0,
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${safe}%`,
                        background: '#ffffff',
                        transition: 'width 0.05s linear',
                        boxShadow: '0 0 6px rgba(255,255,255,0.5)',
                    }}
                />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>]</span>
            <span style={{ color: '#ffffff', minWidth: 36, textAlign: 'right' }}>
                {label}%
            </span>
        </div>
    );
}

// ── Main LoadingScreen ──────────────────────────────────────────────
export default function LoadingScreen({ onDone }) {
    const [lines, setLines] = useState([]);
    const [pct, setPct] = useState(0);
    const [finished, setFinished] = useState(false);
    const [exiting, setExiting] = useState(false);
    const logRef = useRef(null);

    // Stagger boot lines
    useEffect(() => {
        const timers = BOOT_LINES.map(({ text, delay }) =>
            setTimeout(() => setLines(prev => [...prev, text]), 500 + delay)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    // Animate progress 0 → 100
    useEffect(() => {
        let raf;
        const t0 = performance.now();
        const DUR = 2400;
        function tick(now) {
            const p = Math.min(1, (now - t0) / DUR);
            setPct((1 - Math.pow(1 - p, 3)) * 100);
            if (p < 1) raf = requestAnimationFrame(tick);
        }
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    // Gate: real load + min 2.8 s
    useEffect(() => {
        let pageOk = document.readyState === 'complete';
        let timerOk = false;
        function tryFinish() { if (pageOk && timerOk) setFinished(true); }
        const t = setTimeout(() => { timerOk = true; tryFinish(); }, 2800);
        const onLoad = () => { pageOk = true; tryFinish(); };
        if (!pageOk) window.addEventListener('load', onLoad);
        return () => { clearTimeout(t); window.removeEventListener('load', onLoad); };
    }, []);

    // Auto-scroll log
    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [lines]);

    // Exit animation
    useEffect(() => {
        if (!finished) return;
        const t = setTimeout(() => {
            setExiting(true);
            setTimeout(onDone, 700);
        }, 350);
        return () => clearTimeout(t);
    }, [finished, onDone]);

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: '#000000',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                color: '#f0f0f0',
                overflow: 'hidden',
                // Exit
                opacity: exiting ? 0 : 1,
                transform: exiting ? 'scale(1.03)' : 'scale(1)',
                transition: 'opacity 0.65s ease, transform 0.65s cubic-bezier(0.4,0,0.2,1)',
            }}
        >
            {/* Heavy CRT scanlines */}
            <div
                style={{
                    position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 4px)',
                }}
            />

            {/* Vignette */}
            <div
                style={{
                    position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.75) 100%)',
                }}
            />

            {/* B&W matrix rain */}
            <MatrixRain />

            {/* Terminal window */}
            <div
                style={{
                    position: 'relative', zIndex: 3,
                    width: 'min(92vw, 640px)',
                    background: '#000000',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 0,                          // sharp corners = retro
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 0 40px rgba(255,255,255,0.04)',
                    overflow: 'hidden',
                }}
            >
                {/* Title bar */}
                <div
                    style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '8px 14px',
                        borderBottom: '1px solid rgba(255,255,255,0.12)',
                        background: 'rgba(255,255,255,0.04)',
                    }}
                >
                    {/* Greyscale dots */}
                    {['#555', '#888', '#ccc'].map((c, i) => (
                        <span
                            key={i}
                            style={{
                                width: 10, height: 10, borderRadius: '50%',
                                background: c, display: 'inline-block', flexShrink: 0,
                            }}
                        />
                    ))}
                    <span
                        style={{
                            flex: 1, textAlign: 'center',
                            fontSize: 11, letterSpacing: '0.1em',
                            color: 'rgba(255,255,255,0.3)',
                        }}
                    >
                        PORTFOLIO_OS &mdash; boot.sh
                    </span>
                </div>

                {/* Log */}
                <div
                    ref={logRef}
                    className="no-scrollbar"
                    style={{
                        padding: '18px 20px 10px',
                        minHeight: 200, maxHeight: 250,
                        overflowY: 'auto',
                        fontSize: 12.5, lineHeight: 1.9,
                        color: 'rgba(255,255,255,0.65)',
                        scrollbarWidth: 'none',
                    }}
                >
                    {lines.map((line, i) => (
                        <div
                            key={i}
                            style={{ animation: 'loadFadeIn 0.2s ease both', whiteSpace: 'pre' }}
                        >
                            <span style={{ color: 'rgba(255,255,255,0.3)', marginRight: 8 }}>{'>'}</span>
                            {line}
                        </div>
                    ))}

                    {!finished ? (
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                            <span style={{ color: 'rgba(255,255,255,0.3)', marginRight: 8 }}>{'>'}</span>
                            <Cursor />
                        </div>
                    ) : (
                        <div
                            style={{
                                color: '#ffffff',
                                animation: 'loadFadeIn 0.3s ease both',
                                marginTop: 4,
                            }}
                        >
                            <span style={{ marginRight: 8 }}>{'>'}</span>
                            LAUNCHING SESSION...
                        </div>
                    )}
                </div>

                {/* Progress */}
                <div
                    style={{
                        padding: '8px 20px 14px',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                    }}
                >
                    <ProgressBar pct={pct} />
                </div>
            </div>

            {/* Footer */}
            <div
                style={{
                    position: 'absolute', bottom: 22, zIndex: 3,
                    fontSize: 10, letterSpacing: '0.14em',
                    color: 'rgba(255,255,255,0.15)',
                }}
            >
                ANIRBAN ROY &mdash; PORTFOLIO_OS v2.0.4
            </div>

            <style>{`
        @keyframes loadFadeIn {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
