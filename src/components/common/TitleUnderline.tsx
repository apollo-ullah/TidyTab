import { motion } from 'framer-motion';

export const TitleUnderline = () => (
  <motion.div
    initial={{ width: '0%', opacity: 0 }}
    whileInView={{ width: '95%', opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    style={{
      position: 'absolute',
      bottom: -12,
      left: '50%',
      transform: 'translateX(-50%)',
      height: '4px',
      background: 'linear-gradient(90deg, transparent, rgba(179, 157, 219, 0.8), transparent)',
      borderRadius: '4px',
      filter: 'blur(2px)',
      boxShadow: '0 0 8px rgba(179, 157, 219, 0.4)'
    }}
  />
); 