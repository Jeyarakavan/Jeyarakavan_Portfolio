import React, { useRef, useState } from 'react';
import TechLogo from './TechLogos';

export const SkillCard = ({ name, desc, pct, tags, iconName }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');
  const [transition, setTransition] = useState('');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate normalized mouse positions (-1 to 1)
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    
    // Tilt settings
    const maxTilt = 15; // Max angle in degrees
    const rotX = -y * maxTilt;
    const rotY = x * maxTilt;
    
    setTransform(`translateY(-8px) rotateX(${rotX}deg) rotateY(${rotY}deg)`);
    setTransition('none');
  };

  const handleMouseLeave = () => {
    setTransform('');
    setTransition('transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.4s, box-shadow 0.4s');
  };

  return (
    <div
      ref={cardRef}
      className="skill-card reveal"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition }}
    >
      <div className="sk-icon-wrap" style={{ color: name.toLowerCase().includes('python') ? 'var(--accent)' : name.toLowerCase().includes('react') ? 'var(--accent2)' : 'var(--accent3)' }}>
        <TechLogo name={iconName || name} className="sk-icon-svg" />
      </div>
      <h3 className="sk-name">{name}</h3>
      <p className="sk-desc">{desc}</p>
      
      <div className="sk-level">
        <span style={{ fontSize: '.7rem', color: 'var(--muted)' }}>Proficiency</span>
        <span className="sk-pct">{pct}%</span>
      </div>
      
      <div className="sk-track">
        <div 
          className="sk-fill" 
          style={{ width: `${pct}%` }}
        />
      </div>
      
      <div className="sk-tags">
        {tags.map((t, idx) => (
          <span key={idx} className="sk-tag">{t}</span>
        ))}
      </div>
    </div>
  );
};

export default SkillCard;
