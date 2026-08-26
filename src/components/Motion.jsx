import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* Small shared motion primitives. Everything here respects prefers-reduced-motion:
   when the user asks for less motion, elements render in their final state rather
   than animating. */

export function Reveal({ children, delay = 0, y = 18, className, ...rest }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} {...rest}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* Latch to "show" the first time this scrolls into view, and stay there.
   Using whileInView alone would leave any child mounted AFTER the container had
   already animated stuck at its `hidden` state forever — which is exactly what
   happened when a list expanded (e.g. "Show all projects"): the new items were
   in the DOM at opacity 0. Holding animate="show" means late children inherit
   the shown variant and animate in normally. */
export function Stagger({ children, className, gap = 0.07, ...rest }) {
  const reduce = useReducedMotion();
  const [entered, setEntered] = useState(false);

  if (reduce) return <div className={className} {...rest}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={entered ? 'show' : 'hidden'}
      viewport={{ once: true, amount: 0.15 }}
      onViewportEnter={() => setEntered(true)}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, ...rest }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} {...rest}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* A bar/column that grows from its baseline when scrolled into view. */
export function GrowBar({ pct, className, vertical = false, style }) {
  const reduce = useReducedMotion();
  const dim = vertical ? 'height' : 'width';

  if (reduce) {
    return <div className={className} style={{ ...style, [dim]: `${pct}%` }} />;
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ [dim]: 0 }}
      whileInView={{ [dim]: `${pct}%` }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
