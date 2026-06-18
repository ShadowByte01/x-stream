// src/components/MostViewedBadge/MostViewedBadge.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import './MostViewedBadge.css';

/**
 * Renders only if this title is the most-viewed one in the browser.
 * variant:
 *   "corner"  -> small ribbon pinned to a card thumbnail (top-right)
 *   "ribbon"  -> full-width ribbon across the bottom of a poster
 *   "pill"    -> inline pill for hero / details headers
 */
const MostViewedBadge = ({ variant = 'corner', count, showCount = false }) => {
  return (
    <motion.div
      className={`mv-badge mv-${variant}`}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
    >
      <span className="mv-badge-shine" />
      <Flame size={variant === 'pill' ? 15 : 12} className="mv-flame" />
      <span className="mv-label">
        Most Viewed{showCount && count ? ` · ${count}×` : ''}
      </span>
    </motion.div>
  );
};

export default MostViewedBadge;
