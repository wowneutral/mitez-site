import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

/**
 * Scroll-tied drift.
 *
 * The difference between a reveal and this: a reveal is TRIGGERED by
 * scroll and then plays on its own clock, so once it fires the page is
 * static again. This is DRIVEN by scroll — the element's position is a
 * function of where the page is, every frame, so it keeps moving as long
 * as you keep scrolling.
 *
 * That continuous coupling is what people mean by "fluid". A page of
 * triggered animations feels like a slideshow advancing; a page where
 * layers move at different rates feels like a single object with depth.
 *
 * Amounts here are small on purpose (roughly 15-40px over a full pass).
 * Parallax that announces itself looks like a 2013 template.
 */
export default function Parallax({
  as = 'div',
  speed = 0.14,
  className,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  // start end -> end start: 0 when the element's top hits the bottom of
  // the viewport, 1 when its bottom leaves the top. The whole time it is
  // visible is mapped, so the movement never stalls mid-screen.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100]);

  const Tag = motion[as] || motion.div;

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag ref={ref} style={{ y }} className={className} {...rest}>
      {children}
    </Tag>
  );
}
