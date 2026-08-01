import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/* Compact stack: cards overlap slightly, small offset for peek */
const CARD_OFFSET_PX = 56;
const ROTATION_DEG = 4;
const SIDE_OPACITY = 0.6;
const TRANSITION_DURATION = 0.45;
const EASE = [0.25, 0.46, 0.45, 0.94];
const AUTO_ADVANCE_MS = 3500;

const slotConfig = {
  left:   { x: -CARD_OFFSET_PX, rotate: -ROTATION_DEG, opacity: SIDE_OPACITY, zIndex: 1, scale: 1 },
  center: { x: 0,               rotate: 0,              opacity: 1,            zIndex: 2, scale: 1 },
  right:  { x: CARD_OFFSET_PX,  rotate: ROTATION_DEG,   opacity: SIDE_OPACITY, zIndex: 1, scale: 1 },
};

function getSlot(cardIndex, centerIndex, total) {
  const rel = (cardIndex - centerIndex + total) % total;
  if (rel === 0) return 'center';
  if (rel === 1) return 'right';
  return 'left';
}

export default function CardCarousel({ cards, className = '' }) {
  const [centerIndex, setCenterIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = cards.length;

  // Auto-advance; re-arms on every centerIndex change so a manual click
  // (or hover pause) resets the countdown instead of jumping right after.
  useEffect(() => {
    if (n <= 1 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setTimeout(() => {
      setCenterIndex((prev) => (prev + 1) % n);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [centerIndex, n, paused]);

  if (n === 0) return null;

  return (
    <div
      className={`card-carousel-container ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="card-carousel-stack">
        {cards.map((card, i) => {
          const slot = getSlot(i, centerIndex, n);
          const config = slotConfig[slot];
          return (
            <motion.div
              key={card.id ?? i}
              className="card-carousel-card-wrapper"
              initial={false}
              animate={{
                x: config.x,
                y: 0,
                rotate: config.rotate,
                opacity: config.opacity,
                zIndex: config.zIndex,
                scale: config.scale,
              }}
              transition={{
                type: 'tween',
                duration: TRANSITION_DURATION,
                ease: EASE,
              }}
              onClick={() => setCenterIndex(i)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-carousel-card">
                <img
                  src={card.image}
                  alt={card.alt ?? ''}
                  className="card-carousel-card-image"
                  draggable="false"
                  loading="lazy"
                  decoding="async"
                />
                {card.overlay && (
                  <div className="card-carousel-card-overlay">
                    {card.overlay}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
