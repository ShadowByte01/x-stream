import React, { useState } from 'react';
import { X, Trash2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefs, useActions } from '../../lib/useStore';
import * as store from '../../lib/storage';
import './SettingsModal.css';

const ACCENT_COLORS = [
  { name: 'X-Stream Red', value: '#E50914', rgb: '229 9 20' },
  { name: 'Royal Blue', value: '#2563EB', rgb: '37 99 235' },
  { name: 'Emerald', value: '#10B981', rgb: '16 185 129' },
  { name: 'Purple', value: '#8B5CF6', rgb: '139 92 246' },
  { name: 'Amber', value: '#F59E0B', rgb: '245 158 11' },
  { name: 'Rose', value: '#F43F5E', rgb: '244 63 94' },
  { name: 'Cyan', value: '#06B6D4', rgb: '6 182 212' },
];

const SettingsModal = ({ isOpen, onClose }) => {
  const prefs = usePrefs();
  const { setPref } = useActions();
  const [confirmClear, setConfirmClear] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  React.useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const currentAccent = prefs.accentColor || '#E50914';

  const handleColorChange = (color) => {
    setPref('accentColor', color);
    document.documentElement.style.setProperty('--accent-color', color);
    const c = ACCENT_COLORS.find((x) => x.value === color);
    if (c) document.documentElement.style.setProperty('--accent-rgb', c.rgb);
  };

  const doInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
  };

  const doClear = () => {
    store.resetEverything();
    setConfirmClear(false);
    onClose();
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
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 18 }}
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
                <p className="settings-desc">Personalize the Xstream theme</p>
                <div className="color-picker-grid">
                  {ACCENT_COLORS.map((color) => (
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
                <h3>Playback</h3>
                <label className="settings-toggle-row">
                  <span>
                    <strong>Auto-play next episode</strong>
                    <small>Automatically play the next episode for TV shows</small>
                  </span>
                  <span
                    className={`toggle-switch ${prefs.autoplayNext ? 'on' : ''}`}
                    onClick={() => setPref('autoplayNext', !prefs.autoplayNext)}
                  />
                </label>
              </div>

              <div className="settings-section">
                <h3>Install App</h3>
                <p className="settings-desc">Add Xstream to your home screen for a native experience.</p>
                <button
                  className="settings-install-btn"
                  onClick={doInstall}
                  disabled={!deferredPrompt}
                >
                  <Download size={16} />
                  {deferredPrompt ? 'Install Xstream' : 'Already installed / unsupported'}
                </button>
              </div>

              <div className="settings-section">
                <h3>Privacy & Data</h3>
                <p className="settings-desc">
                  All your history, list & ratings live only in this browser. Clear them anytime.
                </p>
                {!confirmClear ? (
                  <button className="settings-danger-btn" onClick={() => setConfirmClear(true)}>
                    <Trash2 size={16} /> Clear all my data
                  </button>
                ) : (
                  <div className="settings-confirm">
                    <span>This removes history, list, ratings & most-viewed data. Continue?</span>
                    <div className="settings-confirm-actions">
                      <button className="settings-cancel" onClick={() => setConfirmClear(false)}>Cancel</button>
                      <button className="settings-danger-btn" onClick={doClear}>Yes, clear it</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="settings-section">
                <h3>About</h3>
                <div className="about-info">
                  <div className="about-row">
                    <span>Version</span>
                    <span className="about-value">3.0.0</span>
                  </div>
                  <div className="about-row">
                    <span>Built with</span>
                    <span className="about-value">React + Vite</span>
                  </div>
                  <div className="about-row">
                    <span>Account</span>
                    <span className="about-value">No sign-in · cookies only</span>
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
