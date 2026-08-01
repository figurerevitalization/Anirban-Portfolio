import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const skillsList = [
    {
        id: 1,
        title: 'Product Engineering',
        tools: 'System Planning, Feature Mapping, Execution Strategy',
        index: '13',
        tagline: 'From Concept to Execution',
        capabilities: 'I translate abstract ideas into structured, build-ready systems. My approach focuses on defining architecture early, mapping execution logic, and engineering products that move from prototype to operational deployment without chaos.',
        whatIBuild: [
            'End-to-end product blueprints',
            'Feature-to-architecture mapping',
            'Structured build roadmaps',
            'Execution-ready technical plans',
            'Operational deployment frameworks',
        ],
        capTags: ['Product', 'Planning', 'Execution', 'Structure', 'Delivery'],
    },
    {
        id: 2,
        title: 'CAD Design & Mechanical Modeling',
        tools: 'CAD Modeling, 3D Design, Mechanical Structuring, Assembly Planning',
        index: '14',
        tagline: 'Design Before You Build',
        capabilities: 'I am well trained in professional CAD designing, specializing in precise mechanical modeling and competition-ready structural design. My approach focuses on accuracy, functional integrity, and real-world manufacturability — ensuring every component is engineered before fabrication.',
        whatIBuild: [
            '3D mechanical component models',
            'Competition robot chassis designs',
            'Assembly-ready structural frameworks',
            'Tolerance-aware mechanical layouts',
            'Fabrication-ready technical designs',
        ],
        capTags: ['CAD', '3D Modeling', 'Mechanical', 'Design', 'Fabrication'],
    },
    {
        id: 15,
        title: 'Technical Strategy',
        tools: 'Architecture Planning, System Scaling, Risk Mapping',
        index: '15',
        tagline: 'Think Before You Build',
        capabilities: 'I approach engineering with long-term scalability in mind. My work involves evaluating trade-offs, defining modular structures, and designing systems that can evolve without structural collapse.',
        whatIBuild: [
            'Scalable system blueprints',
            'Modular architecture frameworks',
            'Risk-aware build strategies',
            'Future-ready integration paths',
            'Structured expansion models',
        ],
        capTags: ['Strategy', 'Scalability', 'Modular', 'Planning', 'Growth'],
    },
    {
        id: 16,
        title: 'Prompt Engineering',
        tools: 'LLM Structuring, Context Design, Response Optimization',
        index: '16',
        tagline: 'Precision in Instruction',
        capabilities: 'I design structured prompts that control model behavior, optimize response quality, and align AI outputs with product requirements. My approach focuses on clarity, constraint definition, and context engineering to ensure predictable and high-value results from large language models.',
        whatIBuild: [
            'Structured system-level prompt frameworks',
            'Behavior-controlled conversational flows',
            'Context-aware instruction chains',
            'AI tone and response calibration models',
            'Task-optimized LLM interaction logic',
        ],
        capTags: ['Prompting', 'LLMs', 'Context', 'Optimization', 'AI'],
    },
];

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.94, y: 24 },
    visible: (isMobile) => ({
        opacity: 1,
        scale: isMobile ? 1 : 1,
        y: 0,
        transition: {
            duration: isMobile ? 0 : 0.4,
            ease: [0.16, 1, 0.3, 1]
        }
    }),
    exit: (isMobile) => ({
        opacity: 0,
        scale: isMobile ? 1 : 0.96,
        y: isMobile ? 0 : 16,
        transition: {
            duration: isMobile ? 0 : 0.25,
            ease: [0.4, 0, 1, 1]
        }
    }),
};

const SkillModal = ({ skill, onClose }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Lock scroll
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        const handler = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('keydown', handler);
            // Restore scroll
            document.body.style.overflow = originalStyle;
        };
    }, [onClose]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 md:bg-black/60 md:backdrop-blur-sm" />

            {/* Glass card — scrollable on small screens */}
            <motion.div
                custom={isMobile}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                className="no-scrollbar relative w-full max-w-xl md:max-w-2xl rounded-2xl overflow-hidden border border-white/10 max-h-[90vh] overflow-y-auto"
                style={{
                    background: isMobile ? '#131313' : 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(200,200,200,0.05) 50%, rgba(255,255,255,0.07) 100%)',
                    backdropFilter: isMobile ? 'none' : 'blur(28px) saturate(140%)',
                    WebkitBackdropFilter: isMobile ? 'none' : 'blur(28px) saturate(140%)',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
                    willChange: 'transform, opacity'
                }}
            >
                {/* Noise texture - hide on mobile */}
                {!isMobile && (
                    <div
                        className="absolute inset-0 opacity-[0.04] pointer-events-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                            backgroundSize: '128px 128px',
                        }}
                    />
                )}

                <div className="relative p-6 sm:p-8 md:p-10">

                    {/* Meta row */}
                    <div className="flex items-start justify-between mb-6 md:mb-8">
                        <span className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase">
                            [ {skill.index} ] — CAPABILITY
                        </span>
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all duration-200 flex-shrink-0 ml-4"
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Title */}
                    <h2
                        className="font-heading uppercase tracking-tighter text-white leading-none mb-2"
                        style={{ fontSize: 'clamp(1.75rem, 5.5vw, 3rem)' }}
                    >
                        {skill.title}
                    </h2>

                    {/* Tagline */}
                    <p className="font-mono text-sm md:text-base text-white/50 tracking-wide mb-6 md:mb-8">
                        — {skill.tagline}
                    </p>

                    {/* ── MY CAPABILITIES ───────────────────────── */}
                    <div className="mb-6 md:mb-8">
                        <p className="font-mono text-[10px] tracking-[0.3em] text-white/35 uppercase mb-3">
                            MY CAPABILITIES
                        </p>
                        <div className="w-full h-px bg-white/10 mb-4" />
                        <p className="font-sans text-base md:text-lg text-white/75 leading-relaxed mb-5 whitespace-pre-line">
                            {skill.capabilities}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {skill.capTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="font-mono text-xs tracking-widest px-3 py-1.5 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-colors duration-200"
                                    style={{ background: 'rgba(255,255,255,0.05)' }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ── WHAT I BUILD ──────────────────────────── */}
                    <div>
                        <p className="font-mono text-[10px] tracking-[0.3em] text-white/35 uppercase mb-3">
                            WHAT I BUILD
                        </p>
                        <div className="w-full h-px bg-white/10 mb-4" />
                        <ul className="flex flex-col gap-2">
                            {skill.whatIBuild.map((item, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-3 font-sans text-sm md:text-base text-white/70"
                                >
                                    <span className="font-mono text-white/25 text-xs mt-1 flex-shrink-0">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </motion.div>
        </motion.div>
    );
};

const Skills = () => {
    const [activeSkill, setActiveSkill] = useState(null);

    return (
        <section id="capabilities" className="w-full bg-brand-light text-brand-dark py-24 md:py-32 px-5 sm:px-6">
            <div className="max-w-7xl mx-auto relative">

                {/* Section header */}
                <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-heading text-4xl md:text-6xl uppercase tracking-tighter"
                    >
                        My Capabilities
                    </motion.h2>
                    <span className="font-mono text-sm tracking-widest hidden md:block">[ SERVICES ]</span>
                </div>

                {/* Skill rows */}
                <div className="flex flex-col border-t border-brand-dark/20">
                    {skillsList.map((skill, idx) => (
                        <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            onClick={() => setActiveSkill(skill)}
                            className="group flex flex-col md:flex-row justify-between items-start md:items-center py-8 md:py-12 border-b border-brand-dark/20 hover:bg-brand-dark/5 transition-colors duration-300 -mx-4 px-4 md:-mx-6 md:px-6 cursor-pointer select-none"
                        >
                            <div className="flex items-start md:items-center gap-3 w-full md:w-auto mb-3 md:mb-0">
                                <h3 className="font-heading text-3xl md:text-5xl uppercase tracking-tighter group-hover:translate-x-2 md:group-hover:translate-x-4 transition-transform duration-500">
                                    {skill.title}
                                </h3>
                            </div>

                            <div className="flex items-center gap-6 md:gap-12 w-full md:w-auto justify-between md:justify-end">
                                <p className="font-sans text-sm md:text-base text-brand-dark/60 max-w-xs hidden md:block">
                                    {skill.tools}
                                </p>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="font-mono text-[10px] tracking-widest text-brand-dark/40 uppercase md:hidden">
                                        tap to explore
                                    </span>
                                    <span className="font-mono text-lg md:text-xl tracking-widest flex items-center gap-2">
                                        <span className="text-brand-dark/40 group-hover:text-brand-dark transition-colors duration-300">
                                            [{skill.index}]
                                        </span>
                                        <svg
                                            className="w-4 h-4 text-brand-dark/30 group-hover:text-brand-dark group-hover:translate-x-1 transition-all duration-300"
                                            fill="none" viewBox="0 0 16 16"
                                        >
                                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {activeSkill && (
                    <SkillModal skill={activeSkill} onClose={() => setActiveSkill(null)} />
                )}
            </AnimatePresence>
        </section>
    );
};

export default Skills;
