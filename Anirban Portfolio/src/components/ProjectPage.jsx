import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Star, X, Linkedin, FileSpreadsheet } from 'lucide-react';
import { PROJECTS } from '../data/projects';

const ProjectPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [selectedImg, setSelectedImg] = useState(null);
    const project = PROJECTS.find(p => p.slug === slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Disable background scroll when lightbox is open
    useEffect(() => {
        if (selectedImg) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [selectedImg]);

    if (!project) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono">
                <h1 className="text-4xl mb-4 text-white/20">404 // PROJECT NOT FOUND</h1>
                <Link to="/" className="text-white hover:underline">RETURN TO BASE</Link>
            </div>
        );
    }

    const currentIndex = PROJECTS.findIndex(p => p.slug === slug);
    const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
            {/* Minimal Nav */}
            {/* Minimal Nav - Paper Theme */}
            <nav
                className="fixed top-0 left-0 w-full z-50 px-6 py-4 md:px-10 md:py-6 flex justify-between items-center border-b border-black/10 shadow-sm"
                style={{
                    backgroundColor: '#fafafa',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundBlendMode: 'multiply',
                    opacity: 0.97
                }}
            >
                <Link to="/#work" className="flex items-center gap-2 group text-black/60 hover:text-black transition-colors duration-300">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-xs tracking-widest uppercase font-bold">Back to Home</span>
                </Link>
                <div className="font-mono text-[10px] tracking-[0.3em] text-black/40 uppercase hidden md:block font-bold">
                    Project Detail [ {project.id.toString().padStart(2, '0')} ]
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-32 md:py-48">
                {/* Header */}
                <div className="mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-mono text-xs tracking-[0.4em] text-white/40 uppercase mb-4"
                    >
                        {project.role}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-heading text-5xl md:text-8xl lg:text-9xl uppercase tracking-tighter leading-none mb-8"
                    >
                        {project.title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-6"
                    >
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={14} className={i < project.stars ? "fill-white" : "text-white/10"} />
                            ))}
                        </div>
                        <div className="w-px h-4 bg-white/20" />
                        <div className="flex gap-4">
                            {project.github && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs font-mono tracking-widest text-white/60 hover:text-white transition-colors"
                                >
                                    <Github size={14} /> GITHUB REPO
                                </a>
                            )}
                            {project.linkedin && (
                                <a
                                    href={project.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs font-mono tracking-widest text-white/60 hover:text-white transition-colors"
                                >
                                    <Linkedin size={14} /> LINKEDIN POST
                                </a>
                            )}
                            {project.googlesheet && (
                                <a
                                    href={project.googlesheet}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs font-mono tracking-widest text-white/60 hover:text-white transition-colors"
                                >
                                    <FileSpreadsheet size={14} /> GOOGLE SHEET
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Hero Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="relative aspect-video mb-8 md:mb-12 overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-1000 border border-white/10"
                >
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover select-none pointer-events-none"
                        fetchPriority="high"
                        decoding="async"
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </motion.div>

                {/* Additional Gallery - Short Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-24 md:mb-32">
                    {project.gallery.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.05 * i }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setSelectedImg(img)}
                            className="group relative aspect-[16/10] rounded-sm overflow-hidden border border-white/5 grayscale hover:grayscale-0 transition-all duration-700 cursor-zoom-in"
                        >
                            <img
                                src={img}
                                alt={`${project.title} view ${i + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none pointer-events-none"
                                loading="lazy"
                                decoding="async"
                                onContextMenu={(e) => e.preventDefault()}
                                onDragStart={(e) => e.preventDefault()}
                            />

                            {/* "Click Me" Hint */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                                <span className="font-mono text-[10px] tracking-[0.2em] text-white uppercase bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/10">Click Me</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
                    <div className="md:col-span-12 font-mono text-[10px] tracking-[0.4em] text-white/25 uppercase border-b border-white/10 pb-4 mb-4">
                        Project Overview
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-7"
                    >
                        <p className="text-xl md:text-3xl font-light text-white/90 leading-tight md:leading-snug mb-8">
                            {project.description}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-5"
                    >
                        <div className="mb-10">
                            <h3 className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase mb-6">Core Technologies</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map(t => (
                                    <span key={t} className="px-3 py-1.5 border border-white/10 text-xs font-mono text-white/60 hover:text-white hover:border-white/30 transition-all cursor-default">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase mb-6">Key Features</h3>
                            <ul className="space-y-3">
                                {project.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-4 text-sm text-white/50 group">
                                        <span className="text-white/20 font-mono text-[10px] mt-1 group-hover:text-white/60 transition-colors">0{i + 1}</span>
                                        <span className="group-hover:text-white/80 transition-colors">{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Nav */}
                <div className="mt-32 md:mt-64 border-t border-white/10 pt-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <Link to="/#work" className="group">
                        <div className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase mb-2 group-hover:text-white/60 transition-colors">Ready to return?</div>
                        <div className="text-2xl md:text-4xl font-heading uppercase group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-4">
                            Go Back Home <ArrowLeft className="rotate-180" />
                        </div>
                    </Link>

                    <div className="flex gap-8">
                        {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors">GitHub</a>
                        )}
                        {project.linkedin && (
                            <a href={project.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors">LinkedIn</a>
                        )}
                        {project.googlesheet && (
                            <a href={project.googlesheet} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors">Google Sheet</a>
                        )}
                        <Link to={`/project/${nextProject.slug}`} className="text-white/40 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors">Next Project</Link>
                    </div>
                </div>
            </main>

            {/* Lightbox Modal - Smokey Glass Theme */}
            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImg(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-black/60 backdrop-blur-xl cursor-zoom-out"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: 10 }}
                            transition={{ type: "spring", damping: 28, stiffness: 400 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-5xl w-full bg-[#1a1a1a] p-2 rounded-sm border border-white/10 shadow-2xl overflow-hidden"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                backgroundBlendMode: 'overlay',
                            }}
                        >
                            <button
                                onClick={() => setSelectedImg(null)}
                                className="absolute top-4 right-4 z-[110] w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/10 transition-all group"
                            >
                                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>

                            <img
                                src={selectedImg}
                                alt="Project Gallery View"
                                className="w-full h-auto max-h-[85vh] object-contain rounded-xs select-none pointer-events-none"
                                onContextMenu={(e) => e.preventDefault()}
                                onDragStart={(e) => e.preventDefault()}
                            />

                            <div className="mt-4 px-4 py-2 border-t border-white/5 flex justify-between items-center text-white/40 font-mono text-[10px] tracking-[0.2em] uppercase">
                                <span>Gallery View // Image</span>
                                <span>{project.title}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectPage;
