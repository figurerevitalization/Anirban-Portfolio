import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

// ─────────────────────────────────────────────────────────────────
// EMAILJS CONFIGURATION
// 1. Sign up at https://www.emailjs.com/
// 2. Connect your Gmail account as a Service.
// 3. Create an Email Template with variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
// ─────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = 'service_npomabk';
const EMAILJS_TEMPLATE_ID = 'template_poyx25s';
const EMAILJS_PUBLIC_KEY = 'niw9zKlkJ-V4WQVIi';
// ─────────────────────────────────────────────────────────────────

const INITIAL = { name: '', email: '', subject: '', message: '' };

const inputBase =
    'w-full bg-transparent border-b border-white/20 py-3 text-sm font-mono text-white/90 placeholder-white/25 outline-none focus:border-white/70 transition-colors duration-300 resize-none';

export default function Contact() {
    const [form, setForm] = useState(INITIAL);
    const [status, setStatus] = useState('idle'); // idle | sending | success | error

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        const templateParams = {
            from_name: form.name,
            from_email: form.email,
            subject: form.subject,
            message: form.message,
            to_email: 'anirban.roy.portfolio@gmail.com'
        };

        try {
            const result = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );

            if (result.status === 200) {
                setStatus('success');
                setForm(INITIAL);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('EmailJS Error:', error);
            setStatus('error');
        }
    };

    return (
        <section
            id="contact"
            className="relative w-full min-h-screen bg-brand-dark text-brand-light flex flex-col px-6 pt-14 pb-8 overflow-hidden"
        >
            {/* Subtle radial bg glow */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(242,242,242,0.04), transparent)' }} />

            <div className="relative max-w-5xl mx-auto w-full flex flex-col flex-1 justify-between gap-10">

                {/* ── Header ──────────────────────────────────────── */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="font-heading text-3xl md:text-4xl lg:text-5xl uppercase tracking-tighter leading-none"
                    >
                        Let's Work Together<span className="dot-blink">.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="font-sans text-white/50 text-sm max-w-xs leading-relaxed md:text-right"
                    >
                        Open to collaborations, freelance projects,<br />
                        and interesting conversations.
                    </motion.p>
                </div>

                {/* ── Form ──────────────────────────────────────────── */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6"
                >
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/35">
                            Your Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Anirban Roy"
                            value={form.name}
                            onChange={set('name')}
                            className={inputBase}
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/35">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="hello@example.com"
                            value={form.email}
                            onChange={set('email')}
                            className={inputBase}
                        />
                    </div>

                    {/* Subject */}
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/35">
                            Subject
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Project collaboration / Freelance inquiry / Just saying hi"
                            value={form.subject}
                            onChange={set('subject')}
                            className={inputBase}
                        />
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/35">
                            Message
                        </label>
                        <textarea
                            required
                            rows={3}
                            placeholder="Tell me about your project, idea, or anything you'd like to discuss…"
                            value={form.message}
                            onChange={set('message')}
                            className={`${inputBase} leading-relaxed`}
                        />
                    </div>

                    {/* Submit row */}
                    <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4 border-t border-white/10">

                        {/* Status feedback */}
                        <AnimatePresence mode="wait">
                            {status === 'success' && (
                                <motion.p key="ok"
                                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="font-mono text-xs text-emerald-400/90 tracking-wide"
                                >
                                    ✓ Message sent — I'll get back to you soon.
                                </motion.p>
                            )}
                            {status === 'error' && (
                                <motion.p key="err"
                                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="font-mono text-xs text-red-400/90 tracking-wide"
                                >
                                    ✕ Something went wrong — try emailing directly.
                                </motion.p>
                            )}
                            {(status === 'idle' || status === 'sending') && (
                                <motion.p key="hint"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="font-mono text-xs text-white/25 tracking-wide"
                                >
                                    Usually reply within 24 hours.
                                </motion.p>
                            )}
                        </AnimatePresence>

                        {/* Button */}
                        <motion.button
                            type="submit"
                            disabled={status === 'sending'}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative flex items-center gap-3 bg-brand-light text-brand-dark px-8 py-3.5 font-mono text-xs tracking-[0.22em] uppercase font-semibold disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        >
                            {/* Hover fill animation */}
                            <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative">
                                {status === 'sending' ? 'Sending…' : 'Send Message'}
                            </span>
                            <svg className="relative w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200"
                                fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </motion.button>
                    </div>
                </motion.form>

                {/* ── Footer strip ──────────────────────────────────── */}
                <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p className="font-mono text-xs text-white/25 tracking-widest uppercase">
                        © {new Date().getFullYear()} Anirban Roy
                    </p>
                    <div className="flex gap-6">
                        {['GitHub', 'LinkedIn', 'Twitter'].map(s => (
                            <a key={s} href="#" className="font-mono text-[10px] text-white/30 hover:text-white/80 tracking-[0.16em] uppercase transition-colors duration-200">
                                {s}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
