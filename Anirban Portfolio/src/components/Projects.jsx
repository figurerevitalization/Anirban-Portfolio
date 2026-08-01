import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../data/projects';

// Slot config: 5 visible positions (0=far-left … 4=far-right, 2=center)
const SLOTS = [
    // w/h (lg), w/h (sm), opacity, zIndex
    { wLg: 240, hLg: 320, wSm: 170, hSm: 230, opacity: 0.40, z: 1 },  // far-left
    { wLg: 285, hLg: 380, wSm: 215, hSm: 290, opacity: 0.65, z: 2 },  // near-left
    { wLg: 340, hLg: 460, wSm: 260, hSm: 355, opacity: 1.00, z: 3 },  // center  ← hero
    { wLg: 285, hLg: 380, wSm: 215, hSm: 290, opacity: 0.65, z: 2 },  // near-right
    { wLg: 240, hLg: 320, wSm: 170, hSm: 230, opacity: 0.40, z: 1 },  // far-right
];

function Stars({ count }) {
    return (
        <div className="flex gap-0.5 mb-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`w-3 h-3 ${i < count ? 'text-amber-400' : 'text-white/20'}`}
                    fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export default function Projects() {
    const [centerIdx, setCenterIdx] = useState(0);
    const dragStart = useRef(0);
    const len = PROJECTS.length;

    // Build 5 visible indices wrapping around total list
    const idxAt = (offset) => (centerIdx + offset + len) % len;
    const visible = [-2, -1, 0, 1, 2].map(offset => ({
        proj: PROJECTS[idxAt(offset)],
        slot: offset + 2,   // 0-4
        offset,
    }));

    const advance = (dir) => setCenterIdx(i => (i + dir + len) % len);

    return (
        <section id="work" className="w-full bg-brand-light text-brand-dark py-20 md:py-28 px-4 sm:px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-10 md:mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="font-heading text-4xl md:text-6xl uppercase tracking-tighter"
                    >
                        Selected Work
                    </motion.h2>
                    <span className="font-mono text-sm tracking-widest hidden md:block text-brand-dark/50">
                        [ PORTFOLIO ]
                    </span>
                </div>

                {/* ── Carousel track ─────────────────────────────── */}
                <div
                    className="relative flex items-center justify-center gap-3 sm:gap-4 lg:gap-5 py-8 sm:py-10 cursor-grab active:cursor-grabbing"
                    onPointerDown={e => { dragStart.current = e.clientX; }}
                    onPointerUp={e => {
                        const delta = dragStart.current - e.clientX;
                        if (Math.abs(delta) > 40) advance(delta > 0 ? 1 : -1);
                    }}
                >
                    {visible.map(({ proj, slot, offset }) => {
                        const cfg = SLOTS[slot];
                        const isCenter = offset === 0;
                        return (
                            <motion.div
                                key={proj.id}
                                layout
                                animate={{ opacity: cfg.opacity }}
                                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                                onClick={() => { if (offset !== 0) advance(offset > 0 ? 1 : -1); }}
                                style={{
                                    zIndex: cfg.z,
                                    flexShrink: 0,
                                    width: `clamp(${cfg.wSm}px, ${cfg.wSm + (cfg.wLg - cfg.wSm) * 0.5}px, ${cfg.wLg}px)`,
                                    height: `clamp(${cfg.hSm}px, ${cfg.hSm + (cfg.hLg - cfg.hSm) * 0.5}px, ${cfg.hLg}px)`,
                                }}
                                whileHover={{ scale: isCenter ? 1.03 : 1.06 }}
                                className="relative rounded-[13px] overflow-hidden cursor-pointer"
                            >
                                {isCenter ? (
                                    <Link to={`/project/${proj.slug}`} className="absolute inset-0 z-40" />
                                ) : null}

                                {/* Image */}
                                <img
                                    src={proj.image}
                                    alt={proj.title}
                                    draggable="false"
                                    loading="lazy"
                                    decoding="async"
                                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,8,8,0.94)] via-[rgba(8,8,8,0.25)] to-transparent" />

                                {/* Arrow link — top right */}
                                <Link
                                    to={`/project/${proj.slug}`}
                                    onClick={e => e.stopPropagation()}
                                    className="absolute top-2.5 right-2.5 z-50 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow transition-colors"
                                >
                                    <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                                    </svg>
                                </Link>

                                {/* Bottom info */}
                                <div className="absolute bottom-0 left-0 right-0 z-20 px-3.5 pb-3.5 pt-2">
                                    <Stars count={proj.stars} />
                                    <p className="text-white font-sans font-semibold text-sm sm:text-base leading-tight truncate">
                                        {proj.title}
                                    </p>
                                    <p className="text-white/55 font-mono text-[10px] sm:text-[11px] tracking-wide mt-0.5 truncate">
                                        {proj.role}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ── Dots + nav arrows ──────────────────────────── */}
                <div className="mt-4 sm:mt-6 flex items-center justify-center gap-5">
                    <button
                        onClick={() => advance(-1)}
                        className="w-10 h-10 rounded-full border border-brand-dark/20 flex items-center justify-center hover:bg-brand-dark hover:text-brand-light transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="flex gap-2 items-center">
                        {PROJECTS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCenterIdx(i)}
                                className={`rounded-full transition-all duration-300 ${i === centerIdx
                                    ? 'w-5 h-1.5 bg-brand-dark'
                                    : 'w-1.5 h-1.5 bg-brand-dark/25 hover:bg-brand-dark/50'}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => advance(1)}
                        className="w-10 h-10 rounded-full border border-brand-dark/20 flex items-center justify-center hover:bg-brand-dark hover:text-brand-light transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

            </div>
        </section>
    );
}
