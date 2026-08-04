import { motion, useScroll, useSpring } from 'motion/react';

/**
 * A reading rail down the right edge, for one long page.
 *
 * WHY HERE AND NOT EVERYWHERE. There is already a hairline across the
 * top of every page. This is a different job: Gainesville is the longest
 * page on the site and the one people read rather than scan, and a
 * vertical rail sits in the axis you are actually travelling — you can
 * see how much is left without looking away from the column.
 *
 * Two pixels wide and at fourteen percent opacity when empty, so it
 * reads as an edge of the page rather than a piece of interface. The
 * spring is the same one the top bar uses: the raw scroll value is exact
 * and therefore twitchy, and lagging it by a few frames gives it the
 * same follow-through the page itself has.
 */
export default function PageProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.35,
  });

  return (
    <div className="page-rail" aria-hidden="true">
      <motion.i style={{ scaleY }} />
    </div>
  );
}
