import { motion, useScroll, useSpring } from 'motion/react';

/**
 * A hairline at the top of the window that fills as the page is read.
 *
 * Two reasons it earns its two pixels. It tells someone how much of a
 * long page is left, which the Terms and Privacy pages badly need. And
 * it puts a permanent, continuously moving response to scrolling on
 * screen — the page is visibly reacting to the reader at all times, not
 * only at the moments a section happens to animate.
 *
 * Spring rather than the raw progress value: the raw value is exact and
 * therefore twitchy. The spring lags it by a few frames and settles,
 * which is the same follow-through the smooth scrolling has.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.35,
  });

  return (
    <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
  );
}
