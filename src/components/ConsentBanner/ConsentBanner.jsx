// src/components/ConsentBanner/ConsentBanner.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Check, X, ShieldCheck } from 'lucide-react';
import { useConsent } from '../../lib/useStore';
import './ConsentBanner.css';

const ConsentBanner = () => {
  const { needsChoice, accept, decline } = useConsent();

  return (
    <AnimatePresence>
      {needsChoice && (
        <motion.div
          className="consent-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="consent-card"
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <div className="consent-icon">
              <Cookie size={26} />
            </div>

            <h2 className="consent-title">Welcome to <span className="brand">Xstream</span></h2>
            <p className="consent-text">
              We use cookies & local storage to remember your <strong>watch history</strong>,
              <strong> My List</strong>, ratings and to pick your <strong>Most Viewed</strong> title.
              Everything stays in <strong>this browser only</strong> — no account, no sign-in, nothing sent to a server.
            </p>

            <div className="consent-guarantee">
              <ShieldCheck size={15} />
              <span>100% private to your device. Clearable anytime in Settings.</span>
            </div>

            <div className="consent-actions">
              <button className="consent-btn decline" onClick={decline}>
                <X size={16} /> Decline
              </button>
              <button className="consent-btn accept" onClick={accept}>
                <Check size={16} /> Accept Cookies
              </button>
            </div>
            <p className="consent-note">
              Decline? The site still works — we just won't remember anything between visits.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsentBanner;
