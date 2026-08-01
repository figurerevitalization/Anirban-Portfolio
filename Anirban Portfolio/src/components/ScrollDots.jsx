import React, { useEffect, useState, useCallback, useRef } from 'react';

const SECTIONS = [
    { id: 'hero', label: 'Home', offset: 0 },
    { id: 'about', label: 'About', offset: -100 },
    { id: 'services', label: 'Build', offset: 180 },
    { id: 'work', label: 'Work', offset: 0 },
    { id: 'capabilities', label: 'Skills', offset: 180 },
    { id: 'contact', label: 'Contact', offset: 0 },
];

// Thin, minimal section-scroll indicator. Uses mix-blend-difference (same
// trick as the hero title) so the dots stay visible over both the dark
// hero/contact sections and the light sections in between, with no need
// to track section background color separately.
const ScrollDots = () => {
    const [active, setActive] = useState('hero');
    const visibleRef = useRef({});

    useEffect(() => {
        const observers = SECTIONS.map(({ id }) => {
            const el = document.getElementById(id);
            if (!el) return null;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    visibleRef.current[id] = entry.intersectionRatio;
                    const top = Object.entries(visibleRef.current).sort((a, b) => b[1] - a[1])[0];
                    if (top && top[1] > 0) setActive(top[0]);
                },
                { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
            );
            obs.observe(el);
            return obs;
        });
        return () => observers.forEach((o) => o?.disconnect());
    }, []);

    const goTo = useCallback((id, offset) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.pageYOffset + offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }, []);

    return (
        <nav
            aria-label="Section navigation"
            className="hidden md:flex fixed right-5 lg:right-7 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-5"
            style={{ mixBlendMode: 'difference' }}
        >
            {SECTIONS.map(({ id, label, offset }) => {
                const isActive = active === id;
                return (
                    <button
                        key={id}
                        type="button"
                        onClick={() => goTo(id, offset)}
                        aria-label={`Go to ${label}`}
                        aria-current={isActive ? 'true' : undefined}
                        className="group relative flex items-center justify-end py-1 -my-1"
                    >
                        <span className="mr-3 font-mono text-[9px] tracking-[0.2em] uppercase text-white opacity-0 translate-x-1 group-hover:opacity-70 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap pointer-events-none">
                            {label}
                        </span>
                        <span
                            className="block rounded-full border border-white transition-all duration-300 ease-out"
                            style={{
                                width: isActive ? 7 : 5,
                                height: isActive ? 7 : 5,
                                background: isActive ? '#fff' : 'transparent',
                                opacity: isActive ? 1 : 0.45,
                            }}
                        />
                    </button>
                );
            })}
        </nav>
    );
};

export default ScrollDots;
