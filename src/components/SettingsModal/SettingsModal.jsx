import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './SettingsModal.css';

const ACCENT_COLORS = [
  { name: 'X-Stream Red', value: '#E50914' },
  { name: 'Royal Blue', value: '#2563EB' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Rose', value: '#F43F5E' },
  { name: 'Cyan', value: '#06B6D4' },
];

const SettingsModal = ({ isOpen, onClose }) => {
  const currentAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#E50914';

  const handleColorChange = (color) => {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('xstream_accent_color', color);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="settings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="settings-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="settings-header">
              <h2>Settings</h2>
              <button className="settings-close" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="settings-body">
              <div className="settings-section">
                <h3>Accent Color</h3>
                <p className="settings-desc">Choose a theme color for X-Stream</p>
                <div className="color-picker-grid">
                  {ACCENT_COLORS.map(color => (
                    <button
                      key={color.value}
                      className={`color-swatch ${currentAccent === color.value ? 'active' : ''}`}
                      style={{ '--swatch-color': color.value }}
                      onClick={() => handleColorChange(color.value)}
                      title={color.name}
                    >
                      <div className="swatch-inner" />
                      <span className="swatch-label">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-section">
                <h3>About</h3>
                <div className="about-info">
                  <div className="about-row">
                    <span>Version</span>
                    <span className="about-value">2.0.0</span>
                  </div>
                  <div className="about-row">
                    <span>Built with</span>
                    <span className="about-value">React + Vite</span>
                  </div>
                  <div className="about-row">
                    <span>Created by</span>
                    <span className="about-value">Abhinit Kumar</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
