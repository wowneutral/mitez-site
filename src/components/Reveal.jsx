import { motion } from 'motion/react';

// Generic scroll-reveal wrapper for non-text elements (cards, dividers,
// numbers, bars) — separate from TextAnimate, which only handles text.
// Several distinct motion presets so the page doesn't read as "one fade
// repeated everywhere."
const VARIANTS = {
  up: { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -28 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } },
  clip: {
    hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    show: { opacity: 1, clipPath: 'inset(0 0 0% 0)' },
  },
};

export default function Reveal({
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  duration = 0.7,
  once = true,
  amount = 0.3,
  className,
  children,
  ...props
}) {
  const MotionTag = motion[Tag] || motion.div;
  return (
    <MotionTag
      className={className}
      variants={VARIANTS[variant] || VARIANTS.up}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
