import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  useReducedMotion,
} from 'motion/react';

/**
 * A band of type that travels sideways while the page travels down.
 *
 * This is the thing that reads as "images sliding across the screen" on
 * the studio sites, minus the images. The effect was never really about
 * photography — it is about a second axis. A page where everything only
 * moves vertically feels like paper being pulled past a window. Add one
 * element moving horizontally and the same scroll suddenly has depth,
 * because two things are now moving at different rates in different
 * directions.
 *
 * Two inputs drive it, and using both is what makes it feel physical
 * rather than mechanical:
 *
 *  POSITION — where the band sits in the viewport maps to how far along
 *  its travel it is. Scroll up and it goes back. It is not a loop
 *  playing on a timer; it is welded to the scrollbar.
 *
 *  VELOCITY — how fast you are scrolling adds a skew. Flick the page and
 *  the band leans into it, then settles when you stop. That lean is the
 *  single most imitated detail on sites like Resn's, and it costs about
 *  four lines. It works because it implies mass: things that resist
 *  being moved feel real.
 *
 * The text is deliberately set at low contrast and marked aria-hidden.
 * It is texture, not reading material.
 */
export default function ScrollBand({ text, speed = 30, repeat = 4, className = '' }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scrollVelocity = useVelocity(scrollYProgress);

  // The raw velocity is spiky and would make the skew jitter. The spring
  // gives it the same follow-through the page itself has.
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 320,
    damping: 46,
    mass: 0.3,
  });

  const skew = useTransform(smoothVelocity, [-2.4, 0, 2.4], [4, 0, -4], {
    clamp: true,
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${speed}%`]);

  if (reduced) return null;

  const items = Array.from({ length: repeat });

  return (
    <div className={`band ${className}`} ref={ref} aria-hidden="true">
      <motion.div className="band-track" style={{ x, skewX: skew }}>
        {items.map((_, i) => (
          <span className="band-item" key={i}>
            {text}
            <span className="band-dot">&bull;</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
