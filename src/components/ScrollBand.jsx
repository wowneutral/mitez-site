import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

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
export default function ScrollBand({ text, repeat = 3, reverse = false, className = '' }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // ALWAYS EXACTLY HALF, which is what makes it seamless.
  //
  // This used to travel by an arbitrary percentage — 26%, 34% — of the
  // track's own width. The track is finite, so past a certain scroll
  // position its right-hand end came into view and the rest of the band
  // was empty. Nothing wrong with the maths; the strip simply ran out.
  //
  // The fix is the oldest marquee trick there is: render the content
  // twice and travel exactly -50%. At the end of the journey the second
  // copy sits precisely where the first one started, so the strip is
  // indistinguishable from where it began and there is no edge to reach.
  // `speed` now sets how much of that journey a screen of scrolling
  // covers, via the repeat count, rather than how far the strip moves.
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? ['-50%', '0%'] : ['0%', '-50%'],
  );

  if (reduced) return null;

  // Rendered twice over: `repeat` copies, then the same again. The
  // second half is not decoration — it is the thing that makes -50%
  // land on an identical frame. Each half must also be wider than the
  // viewport or a gap can open mid-journey, which three copies of a
  // phrase at this size comfortably are.
  const items = Array.from({ length: repeat * 2 });

  return (
    <div className={`band ${className}`} ref={ref} aria-hidden="true">
      <motion.div className="band-track" style={{ x }}>
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

/*
 * THE SKEW WAS REMOVED, and it is worth saying why since it was the
 * flashiest part.
 *
 * It ran the scroll velocity through a spring and mapped that to skewX,
 * so the band leaned when you flicked the page. It looked good and it
 * was expensive in the worst way: a skew forces the strip to be
 * re-rasterised rather than just re-positioned, and it did that on every
 * frame of every scroll, on a layer the width of several screens.
 *
 * Translation on its own is a compositor operation — the texture is
 * drawn once and then moved. That is the whole difference between a
 * band that costs nothing and a band that makes the page stutter, and
 * a stutter destroys far more of the premium feel than a lean adds.
 */
