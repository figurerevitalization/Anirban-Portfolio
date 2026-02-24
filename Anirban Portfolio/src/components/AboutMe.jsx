import React from 'react';
import { motion } from 'framer-motion';
import CardCarousel from './CardCarousel';

const ABOUT_CARDS = [
  {
    id: 'profile',
    image: '/center.png',
    alt: 'Anirban Roy',
    overlay: (
      <>
        <p className="card-carousel-label">Anirban Roy</p>
        <p className="card-carousel-sublabel">Full-Stack Engineer · Kolkata</p>
      </>
    ),
  },
  {
    id: '2',
    image: '/right.png',
    alt: 'Featured Work',
    overlay: (
      <>
        <p className="card-carousel-label">Featured Work</p>
        <p className="card-carousel-sublabel">Projects & case studies</p>
      </>
    ),
  },
  {
    id: '3',
    image: '/left.png',
    alt: 'Get in Touch',
    overlay: (
      <>
        <p className="card-carousel-label">Get in Touch</p>
        <p className="card-carousel-sublabel">Let&apos;s build something</p>
      </>
    ),
  },
];

const AboutMe = () => {
  return (
    <section id="about" className="w-full bg-brand-light text-brand-dark py-16 md:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6 xl:gap-10">
          <div className="lg:flex-[3]">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter mb-4"
            >
              Hello, I'm <br />Anirban<span className="dot-blink">.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-lg md:text-xl leading-relaxed text-brand-dark/90 md:min-h-[140px]"
            >
              As a B.Tech engineer, I develop hardware and software intelligent systems. I design scalable digital platforms while engineering practical hardware systems at the nexus of automation, robotics, ERP architecture, and artificial intelligence. Building solutions that work, scale, and integrate seamlessly is my main goal.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 lg:mt-0 flex justify-center flex-shrink-0 lg:flex-[2]"
          >
            <CardCarousel cards={ABOUT_CARDS} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
