import { Variants } from 'framer-motion';

const headerVariant: Variants = {
  static: {
    y: '50%',
  },
  animate: {
    y: '0',
    transition: {
      delay: 0.3,
      duration: 0.5,
    },
  },
};

const infoVariant: Variants = {
  static: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      delay: 0.7,
      duration: 0.5,
    },
  },
};

const arrowVariant: Variants = {
  static: {
    x: 0,
  },
  animate: {
    x: '5px',
    transition: {
      repeat: Infinity,
      ease: 'easeInOut',
      repeatType: 'mirror',
      delay: 0,
      duration: 0.4,
    },
  },
};

export { arrowVariant, infoVariant, headerVariant };
