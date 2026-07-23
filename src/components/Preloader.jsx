import React, { useEffect, useState, useRef } from 'react';

const Preloader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  });

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1800; // 1.8 seconds progress animation

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      
      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setHidden(true);
            if (onFinishRef.current) onFinishRef.current();
          }, 500);
        }, 150);
      }
    }, 20);

    return () => clearInterval(timer);
  }, []);

  if (hidden) return null;

  return (
    <div className={`preloader-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="preloader-content">
        <div className="preloader-logo-ring">
          <div className="preloader-initials">JJ</div>
          <div className="preloader-spinner" />
        </div>
        <div className="preloader-text">Loading Experience</div>
        <div className="preloader-bar-bg">
          <div className="preloader-bar-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <div className="preloader-percent">{Math.min(progress, 100)}%</div>
      </div>
    </div>
  );
};

export default Preloader;
