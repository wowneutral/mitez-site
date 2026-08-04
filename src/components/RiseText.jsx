import { Fragment } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * Masked word reveal.
 *
 * TextAnimate fades and slides words in. This does something different in
 * a way that is hard to name and easy to feel: each word sits inside a
 * box with `overflow: hidden` and rises INTO it from below, so the text
 * appears to be uncovered rather than to fly in. Nothing is ever seen
 * out of place — no word floating in from empty space, no half-faded
 * ghost — which is why it reads as deliberate rather than as an effect
 * that was switched on.
 *
 * It is the reveal on essentially every site that gets called premium,
 * and the reason it works is restraint: one gesture, one direction, one
 * easing curve, used everywhere. Five different entrance animations is
 * what makes a page feel like a demo reel.
 */

// Long, slow, and heavily eased. The stagger is what does the work:
// words arriving 55ms apart read as a single sweep, while the same
// animation fired simultaneously reads as a jump cut.
const EASE = [0.16, 1, 0.3, 1];

export default function RiseText({
  as = 'h2',
  children,
  className,
  delay = 0,
  duration = 1.05,
  stagger = 0.055,
  once = true,
  amount = 0.35,
  ...rest
}) {
  const Tag = motion[as] || motion.div;
  const reduced = useReducedMotion();
  const text = typeof children === 'string' ? children : null;

  // Anything that is not a plain string (an element, an interpolation)
  // is passed straight through unanimated rather than being split apart
  // and silently mangled.
  if (!text || reduced) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const words = text.split(' ').filter(Boolean);

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      // Screen readers get the sentence once, from the label. The visible
      // words are hidden from them so the text is not announced as a pile
      // of disconnected fragments.
      aria-label={text}
      {...rest}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="rise-word" aria-hidden="true">
            <motion.span
              className="rise-word-in"
              variants={{ hidden: { y: '112%' }, show: { y: '0%' } }}
              transition={{ duration, ease: EASE }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}
