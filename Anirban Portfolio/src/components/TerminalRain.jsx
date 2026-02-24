import { useEffect, useRef } from 'react';

// ── Word pools ────────────────────────────────────────────────────
const EN = [
    'DREAM', 'MOTION', 'SIGNAL', 'BUILD', 'LEARN', 'CREATE',
    'FOCUS', 'POWER', 'LIGHT', 'ORBIT', 'PULSE', 'CRAFT',
    'FORGE', 'TRACE', 'SPARK', 'SENSE', 'FLOW', 'THINK',
    'NEURAL', 'SERVO', 'LIDAR', 'TORQUE', 'SENSOR', 'FUSION',
    'ENCODE', 'KERNEL', 'THREAD', 'VECTOR', 'GYRO', 'ADAPT',
    'EVOLVE', 'SYSTEM', 'COMPUTE', 'INFER', 'ROBOT', 'MOTOR',
];
const BN = [
    'যন্ত্র', 'শক্তি', 'গতি', 'স্বপ্ন',
    'আলো', 'মন', 'বিজ্ঞান', 'সংকেত',
    'সৃষ্টি', 'প্রবাহ',
];
const HI = [
    'यंत्र', 'शक्ति', 'गति', 'सपना',
    'प्रकाश', 'मन', 'विज्ञान', 'संकेत',
    'सृजन', 'यात्रा',
];
const ALL = [...EN, ...BN, ...HI];

function randWord() {
    return ALL[Math.floor(Math.random() * ALL.length)];
}

// ── Layout constants ──────────────────────────────────────────────
const FONT_SIZE = 14;
const LINE_H = FONT_SIZE * 3.2;
const COL_GAP = 120;
const DENSITY = 0.55;
const CENTER_CLEAR = 0.44;
const FADE_STEP = 0.016;

// "Head" character glow — bright cyan-white at the active typing position
const HEAD_COLOR = 'rgba(200,255,240,1)';
const HEAD_BLUR = 14;

// Trailing chars dim from baseOpacity down toward 40% of it
const TRAIL_FALLOFF = 0.3;  // each char above head gets × this dimmer (min 40%)

export default function TerminalRain() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animId;
        let cols = [];

        // ── Resize ────────────────────────────────────────────────────
        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            buildCols();
        }

        // ── Build columns — skip the centre hero zone ─────────────────
        function buildCols() {
            const slots = Math.floor(canvas.width / COL_GAP);
            const lo = canvas.width * (0.5 - CENTER_CLEAR / 2);
            const hi = canvas.width * (0.5 + CENTER_CLEAR / 2);
            cols = [];
            for (let i = 0; i < slots; i++) {
                const x = i * COL_GAP + COL_GAP / 2;
                if (x > lo && x < hi) continue;
                if (Math.random() > DENSITY) continue;
                cols.push(makeCol(x));
            }
        }

        function makeCol(x) {
            return {
                x,
                state: 'idle',
                idleLeft: Math.floor(Math.random() * 260),
                chars: [],
                revealed: 0,
                startY: 0,
                opacity: 0,
                baseOpacity: 0.22 + Math.random() * 0.26,
                typingSpeed: 4 + Math.floor(Math.random() * 8),
                typingFrame: 0,
                holdLeft: 0,
            };
        }

        function startWord(col) {
            const word = randWord();
            col.chars = [...word];
            col.revealed = 0;
            const wordH = col.chars.length * LINE_H;
            const margin = FONT_SIZE * 4;
            const maxY = Math.max(margin, canvas.height - wordH - margin);
            col.startY = margin + Math.random() * maxY;
            col.opacity = 0;           // fade-in from 0
            col.state = 'typing';
            col.typingFrame = 0;
        }

        // ── Draw helpers ──────────────────────────────────────────────
        function drawChar(ch, x, y, alpha, isHead) {
            if (isHead) {
                // Glowing "active" head character
                ctx.shadowBlur = HEAD_BLUR;
                ctx.shadowColor = HEAD_COLOR;
                ctx.fillStyle = HEAD_COLOR;
            } else {
                ctx.shadowBlur = 6;
                ctx.shadowColor = `rgba(180,255,230,${alpha * 0.4})`;
                ctx.fillStyle = `rgba(242,242,242,${alpha})`;
            }
            ctx.fillText(ch, x, y);
            // Reset shadow so it doesn't bleed to next draw call
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
        }

        // ── Main loop — clearRect every frame, no trail accumulation ──
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${FONT_SIZE}px 'IBM Plex Mono','Noto Mono','Courier New',monospace`;
            ctx.textAlign = 'center';

            for (const col of cols) {

                // ── IDLE ────────────────────────────────────────────────
                if (col.state === 'idle') {
                    col.idleLeft--;
                    if (col.idleLeft <= 0) startWord(col);
                    continue;
                }

                // ── TYPING ─────────────────────────────────────────────
                if (col.state === 'typing') {
                    // Smooth fade-in during first few revealed chars
                    col.opacity = Math.min(col.baseOpacity, col.opacity + col.baseOpacity / 4);

                    const head = col.revealed - 1; // index of latest revealed char
                    for (let i = 0; i < col.revealed; i++) {
                        // Chars farther from head are slightly dimmer
                        const dist = head - i;
                        const dimmed = col.opacity * Math.max(0.4, 1 - dist * TRAIL_FALLOFF);
                        const isHead = i === head;
                        drawChar(col.chars[i], col.x, col.startY + i * LINE_H, dimmed, isHead);
                    }

                    col.typingFrame++;
                    if (col.typingFrame >= col.typingSpeed) {
                        col.typingFrame = 0;
                        if (col.revealed < col.chars.length) {
                            col.revealed++;
                        } else {
                            col.state = 'hold';
                            col.holdLeft = 55 + Math.floor(Math.random() * 100);
                        }
                    }
                    continue;
                }

                // ── HOLD ───────────────────────────────────────────────
                if (col.state === 'hold') {
                    // All chars at full uniform opacity — gentle pulse via sin
                    const pulse = 1 + 0.06 * Math.sin(Date.now() / 700);
                    for (let i = 0; i < col.chars.length; i++) {
                        drawChar(col.chars[i], col.x, col.startY + i * LINE_H,
                            col.opacity * pulse, false);
                    }
                    col.holdLeft--;
                    if (col.holdLeft <= 0) col.state = 'fade';
                    continue;
                }

                // ── FADE ────────────────────────────────────────────────
                if (col.state === 'fade') {
                    col.opacity = Math.max(0, col.opacity - FADE_STEP);
                    for (let i = 0; i < col.chars.length; i++) {
                        drawChar(col.chars[i], col.x, col.startY + i * LINE_H,
                            col.opacity, false);
                    }
                    if (col.opacity <= 0) {
                        col.state = 'idle';
                        col.idleLeft = 70 + Math.floor(Math.random() * 160); // 1.2–3.8 s gap
                    }
                }
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
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
        />
    );
}
