import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedWordsProps {
  text: string;
}

export const AnimatedWords: React.FC<AnimatedWordsProps> = ({ text }) => {
  const words = text.split(' ').map((word) => ({ text: word, className: '' }));

  return (
    <span style={{ display: 'inline-block' }}>
      {words.map((word, index) => (
        <span key={`${word.text}-${index}`} style={{
          display: 'inline-block',
          overflow: 'hidden',
          verticalAlign: 'bottom',
          marginRight: '0.26em',
          paddingBottom: '0.25rem',
        }}>
          <motion.span
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.85,
              delay: 0.15 + index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ display: 'inline-block' }}
          >
            {word.text}
          </motion.span>
        </span>
      ))}
    </span>
  );
};
