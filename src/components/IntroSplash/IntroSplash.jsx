import React, { useEffect, useState } from 'react';
import './IntroSplash.css';

const IntroSplash = ({ onComplete }) => {
  const [stage, setStage] = useState('start');

  useEffect(() => {
    // 0.1s: Trigger 'appear' stage to pop the 'X' in
    const timer1 = setTimeout(() => {
      setStage('appear');
    }, 100);

    // 1.5s: Trigger 'zoom-bars' stage to expand the 'X' and shoot out the colored bars
    const timer2 = setTimeout(() => {
      setStage('zoom-bars');
    }, 1500);

    // 4.5s: Trigger 'fade-out' stage to dissolve the black background
    const timer3 = setTimeout(() => {
      setStage('fade-out');
    }, 4500);

    // 5.3s: Animation fully completes, tell parent to unmount
    const timer4 = setTimeout(() => {
      onComplete();
    }, 5300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  // Generate 40 colored bars for the light-speed spectrum effect
  const colors = ['#e50914', '#ff7b00', '#b5179e', '#4361ee', '#4cc9f0', '#f72585'];
  
  const bars = Array.from({ length: 40 }).map((_, i) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const delay = Math.random() * 0.4; // random start delay for organic feel
    const style = {
      backgroundColor: randomColor,
      animationDelay: `${delay}s`
    };
    return <div key={i} className="spectrum-bar" style={style}></div>;
  });

  return (
    <div className={`intro-splash-container ${stage === 'fade-out' ? 'fade-out' : ''}`}>
      {/* The Cinematic 'X' */}
      <div className={`cinematic-x-container ${stage}`}>
        <h1 className="cinematic-x">X</h1>
      </div>
      
      {/* The colorful vertical lightspeed bars */}
      <div className={`spectrum-bars-container ${stage}`}>
        {bars}
      </div>
    </div>
  );
};

export default IntroSplash;
