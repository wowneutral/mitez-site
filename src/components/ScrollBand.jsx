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
/**
 * @param speed  How far it travels, in screens, across one full pass.
 *               0.3 = a third of the viewport width. Lower is calmer;
 *               above about 0.6 the type stops being readable while the
 *               page is moving.
 * @param reverse Travels left to right instead. USE THIS ONLY FOR BANDS
 *               NOBODY NEEDS TO READ. Text moving against the direction
 *               it is read in cannot be tracked by the eye — you catch a
 *               word, your gaze runs the wrong way to follow it — so a
 *               reversed band reads as noticeably faster than a forward
 *               one at the same speed. It is fine for texture, wrong for
 *               anything carrying information.
 */
export default function ScrollBand({
  text,
  speed = 0.3,
  repeat = 3,
  reverse = false,
  className = '',
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // SPEED IS IN SCREENS, not percentages, and that is the fix.
  //
  // Both previous versions expressed travel as a percentage of the
  // TRACK — first an arbitrary 26%, then -50%, then one copy's width.
  // Every one of those is unreadable as a number, because the track's
  // width depends on how many copies there are and how long the phrase
  // is. "-50%" was three whole copies of travel across one screen of
  // scrolling: the band sprinted while the page walked, and the words
  // blurred past unread.
  //
  // In viewport units the number means something. 0.3 is "moves a third
  // of a screen while it crosses the screen" — slower than the page
  // itself, so the words stay readable and the band reads as a slower
  // layer behind the content rather than a thing rushing past it.
  //
  // Seamlessness is no longer the constraint it was. This is scroll-
  // linked and one-directional rather than a loop, so nothing has to
  // land on a matching frame; it only has to never show an end. Six
  // copies against a third of a screen of travel is an enormous margin.
  const travel = speed * 100;
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? [`-${travel}vw`, '0vw'] : ['0vw', `-${travel}vw`],
  );

  if (reduced) return null;

  // Enough copies that the strip is wider than the viewport by a clear
  // margin even after travelling one copy's width. Six is comfortable
  // for a phrase at this size on any screen this ships to; the extras
  // are what stop an edge ever reaching the frame.
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
