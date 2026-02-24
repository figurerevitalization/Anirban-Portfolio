import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const NAV_LINKS = [
    { label: 'Home', href: '#hero', offset: 0 },
    { label: 'About', href: '#about', offset: -100 },
    { label: 'What I Build', href: '#services', offset: 180 },
    { label: 'Selected Work', href: '#work', offset: 0 },
    { label: 'Capabilities', href: '#capabilities', offset: 180 },
    { label: 'Contact', href: '#contact', offset: 0 },
];

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const location = useLocation();

    // ── Detect dark/light section under navbar ──────────────
    const [isDark, setIsDark] = useState(true); // hero is dark by default

    // Close menu on route change
    useEffect(() => {
        setOpen(false);
    }, [location]);

    useEffect(() => {
        const DARK_IDS = ['hero', 'contact'];
        const observers = [];
        const visible = {};

        const update = () => {
            const top = Object.entries(visible).sort((a, b) => b[1] - a[1])[0];
            if (top) setIsDark(DARK_IDS.includes(top[0]));
        };

        ['hero', 'about', 'services', 'work', 'capabilities', 'contact'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => { visible[id] = entry.intersectionRatio; update(); },
                { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach(o => o.disconnect());
    }, []);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target) &&
                buttonRef.current && !buttonRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleScroll = (e, href, offset) => {
        e.preventDefault();
        setOpen(false);
        const targetId = href.replace('#', '');
        const elem = document.getElementById(targetId);
        if (elem) {
            const top = elem.getBoundingClientRect().top + window.pageYOffset + offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    return (
        <>
            <header
                className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-3 sm:py-2 flex justify-between items-center"
                style={{
                    background: isDark ? 'rgba(15,15,15,0.55)' : 'rgba(255,255,255,0.65)',
                    backdropFilter: 'blur(18px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(18px) saturate(160%)',
                    borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)',
                    boxShadow: isDark ? '0 2px 24px rgba(0,0,0,0.18)' : '0 2px 20px rgba(0,0,0,0.08)',
                    color: isDark ? 'white' : 'black',
                    transition: 'background 0.35s ease, color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
                }}
            >
                <div className="font-mono text-lg sm:text-xl tracking-widest font-bold">
                    ANIRBAN<span className="dot-blink">.</span>
                </div>

                {/* MENU trigger */}
                <button
                    ref={buttonRef}
                    onClick={() => setOpen(v => !v)}
                    aria-expanded={open}
                    aria-label="Toggle menu"
                    className="font-mono text-xs sm:text-sm tracking-widest px-3 py-2 rounded-full flex items-center gap-2"
                >
                    <span>[</span>
                    <span>{open ? 'CLOSE' : 'MENU'}</span>
                    <span>]</span>
                </button>
            </header>

            {/* ── Retro popup menu ───────────────────────────────── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        ref={menuRef}
                        key="retro-menu"
                        initial={{ opacity: 0, scale: 0.92, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed top-16 right-4 sm:right-6 z-[60] w-60 max-w-[80vw] bg-white border border-black/10 shadow-2xl"
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                        {/* Header bar */}
                        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                            <span className="text-[10px] tracking-[0.22em] uppercase text-black/35">
                                Navigation
                            </span>
                            {/* Retro traffic lights */}
                            <div className="flex gap-1.5">
                                {['bg-black/20', 'bg-black/20', 'bg-black/20'].map((c, i) => (
                                    <span key={i} className={`inline-block w-2 h-2 rounded-full ${c}`} />
                                ))}
                            </div>
                        </div>

                        {/* Links */}
                        <nav>
                            {NAV_LINKS.map((link, i) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={(e) => handleScroll(e, link.href, link.offset)}
                                    className="group flex items-center justify-between px-3 py-2.5 border-b border-black/[0.07]"
                                >
                                    <span className="text-[11px] tracking-[0.14em] uppercase text-black">
                                        {link.label}
                                    </span>
                                    <span className="text-[9px] text-black/25 tracking-widest">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                </a>
                            ))}
                        </nav>

                        {/* Footer */}
                        <div className="px-3 py-2 text-[9px] tracking-[0.18em] text-black/25 uppercase">
                            © {new Date().getFullYear()} Anirban Roy
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
