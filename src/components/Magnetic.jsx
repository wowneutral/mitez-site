import { useRef } from 'react';
import { motion, useSpring, useReducedMotion } from 'motion/react';
import { play } from '../lib/sound.js';

/**
 * A control that leans toward the pointer.
 *
 * One of the small interactive details that makes a site feel alive
 * rather than rendered. The button is not waiting to be hit — it moves
 * toward you as you approach, so the click feels like the end of a
 * gesture that started several hundred pixels earlier.
 *
 * Three things keep it from being annoying:
 *
 *  - The pull is a fraction of the pointer's offset (0.28), not a snap
 *    to the cursor. The control still occupies roughly where the eye
 *    expects it, so nobody has to chase it.
 *  - It is spring-driven, so releasing does not teleport it back.
 *  - It only reacts within its own bounds. Magnetism that reaches out
 *    across the page makes a layout feel unstable.
 *
 * Disabled entirely for reduced motion, and it never fires on touch,
 * where there is no pointer to be attracted to.
 */
export default function Magnetic({ children, strength = 0.28, className = '' }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const spring = { stiffness: 260, damping: 18, mass: 0.4 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  if (reduced) {
    return <span className={`magnetic ${className}`}>{children}</span>;
  }

  const onMove = (e) => {
    if (e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength * 1.3);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className={`magnetic ${className}`}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'touch') play('hover');
      }}
      onPointerLeave={onLeave}
      onClick={() => play('click')}
    >
      {children}
    </motion.span>
  );
}
