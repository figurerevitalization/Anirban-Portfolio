import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import TerminalRain from './TerminalRain';
import MobileHero from './MobileHero';


const Hero = ({ onHeroReady }) => {
    const { scrollY } = useScroll();
    const yText = useTransform(scrollY, [0, 1000], [0, 80]);
    const opacity = useTransform(scrollY, [0, 800], [1, 0]);

    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const roles = ["Engineer.", "Designer.", "Creator.", "Thinker.", "Philosopher.", "Writer.", "Storyteller.", "Explorer.", "Knowledge Seeker."];
    const [roleIndex, setRoleIndex] = useState(0);
    const splineScrollLockRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const timeInterval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        const roleInterval = setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % roles.length);
        }, 2000);
        return () => {
            clearInterval(timeInterval);
            clearInterval(roleInterval);
        };
    }, []);

    // On desktop: intercept wheel events on the Spline canvas in CAPTURE phase.
    // stopPropagation() prevents Spline from seeing or handling the event,
    // but we do NOT call preventDefault() — so the browser does its own native
    // smooth scroll exactly as if the user scrolled anywhere else on the page.
    useEffect(() => {
        if (isMobile) return;
        const wrapper = splineScrollLockRef.current;
        if (!wrapper) return;

        let cleanup = () => { };

        const attach = () => {
            const canvas = wrapper.querySelector('canvas');
            if (!canvas) { setTimeout(attach, 200); return; }

            const onWheel = (e) => {
                e.stopPropagation();      // Spline never sees it
                // No preventDefault() → browser scrolls naturally
            };

            canvas.addEventListener('wheel', onWheel, { capture: true, passive: true });
            cleanup = () => canvas.removeEventListener('wheel', onWheel, { capture: true });
        };

        attach();
        return () => cleanup();
    }, [isMobile]);

    // Track viewport to switch to lightweight mobile hero
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const update = () => setIsMobile(window.innerWidth < 768);
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    // ── 3D Asset config (responsive for desktop / tablet) ─────────
    const [assetSize, setAssetSize] = useState(520);
    const [xPos, setXPos] = useState(-12);
    const [yPos] = useState(171); // keep vertical offset stable
    const scrollDrift = 140;  // How far asset drifts down on scroll (px)

    useEffect(() => {
        const computeLayout = () => {
            if (typeof window === 'undefined') return;
            const w = window.innerWidth;

            if (w >= 1280) {
                setAssetSize(700);
                setXPos(-17);
            } else if (w >= 1024) {
                setAssetSize(640);
                setXPos(-20);
            } else if (w >= 768) {
                setAssetSize(520);
                setXPos(-10);
            } else {
                // On mobile we'll show a lightweight static asset instead of Spline
                setAssetSize(360);
                setXPos(0);
            }
        };

        computeLayout();
        window.addEventListener('resize', computeLayout);
        return () => window.removeEventListener('resize', computeLayout);
    }, []);

    const yGraphic = useTransform(scrollY, [0, 1000], [0, scrollDrift]);

    // Signal to App when hero is ready.
    // On desktop/tablet we wait for Spline (or a timeout).
    // On mobile we resolve immediately so the UI can appear without heavy 3D.
    const signalReady = useCallback(() => {
        if (onHeroReady) {
            onHeroReady();
        }
    }, [onHeroReady]);

    useEffect(() => {
        if (!onHeroReady) return;

        // Mobile: no heavy asset, we can show immediately.
        if (isMobile) {
            signalReady();
            return;
        }

        // Desktop/tablet fallback timeout in case Spline is slow.
        const t = setTimeout(() => {
            signalReady();
        }, 7000);

        return () => clearTimeout(t);
    }, [onHeroReady, isMobile, signalReady]);

    const sectionClass = isMobile
        ? 'relative w-full min-h-screen bg-brand-dark flex items-center justify-center overflow-hidden pt-20 pb-10 px-4'
        : 'relative w-full min-h-screen bg-brand-dark flex flex-col justify-center items-center overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20';

    return (
        <section
            id="hero"
            className={sectionClass}
        >
            {/* Mobile: full retro HUD hero handled in its own component */}
            {isMobile ? (
                <MobileHero time={time} />
            ) : (
                <>
                    <TerminalRain />

                    <motion.div
                        style={{ opacity, y: yText }}
                        className="relative z-10 w-full max-w-7xl px-4 sm:px-6 mx-auto flex flex-col items-center"
                    >
                        <div className="relative flex flex-col items-center justify-center w-full min-h-[420px] sm:min-h-[500px]">
                            <motion.div
                                style={{ width: assetSize, height: assetSize, x: xPos, y: yGraphic }}
                                className="absolute flex items-center justify-center transform-gpu z-10 pointer-events-auto"
                            >
                                <div
                                    className="absolute inset-0 w-full h-full pointer-events-auto flex items-center justify-center"
                                    style={{
                                        WebkitMaskImage:
                                            'radial-gradient(circle at center, black 10%, transparent 50%)',
                                        maskImage:
                                            'radial-gradient(circle at center, black 10%, transparent 50%)',
                                    }}
                                >
                                    <div ref={splineScrollLockRef} className="w-full h-full">
                                        <Spline
                                            scene="https://prod.spline.design/HbPNmWHkdPFf0vCW/scene.splinecode"
                                            onLoad={signalReady}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="relative font-heading text-5xl sm:text-6xl md:text-8xl lg:text-[120px] uppercase tracking-tighter leading-none text-brand-accent transform-gpu z-20 pointer-events-none text-center mix-blend-difference px-3 sm:px-0"
                            >
                                Anirban <br className="md:hidden" />Roy
                                <span className="text-brand-accent ml-1 dot-blink">
                                    .
                                </span>
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 1 }}
                                className="mt-8 text-center h-12 relative z-20 select-none"
                            >
                                <p className="font-mono text-xl md:text-2xl text-brand-light">
                                    I am an{' '}
                                    [
                                    <motion.span
                                        key={roleIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-brand-accent inline-block"
                                    >
                                        {roles[roleIndex]}
                                    </motion.span>
                                    ]
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-5 left-6 font-mono text-xs text-brand-light/60 mix-blend-difference z-20"
                    >
                        LOCAL TIME — {time}
                    </motion.div>
                </>
            )}
        </section>
    );
};

export default Hero;
