import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type RevealProps = Omit<
  HTMLMotionProps<'div'>,
  'initial' | 'whileInView' | 'viewport' | 'transition'
> & {
  delay?: number;
  y?: number;
  duration?: number;
};

export const Reveal: React.FC<RevealProps> = ({
  delay = 0,
  y = 30,
  duration = 0.6,
  children,
  ...rest
}) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: '-80px' }}
    transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    {...rest}
  >
    {children}
  </motion.div>
);

export default Reveal;
