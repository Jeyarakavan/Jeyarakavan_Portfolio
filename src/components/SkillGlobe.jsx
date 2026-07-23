import React from 'react';

const SkillGlobe = ({ logos, skills }) => {
  const allSkills = Object.values(skills).flat();

  // Dynamically calculate and distribute skills evenly across 4 aligned 3D orbital rings
  const itemsPerRing = Math.ceil(allSkills.length / 4);
  const rings = [
    { items: allSkills.slice(0, itemsPerRing), tiltX: 65, radius: 240, dur: 22, rev: false },
    { items: allSkills.slice(itemsPerRing, itemsPerRing * 2), tiltX: 35, radius: 255, dur: 28, rev: true },
    { items: allSkills.slice(itemsPerRing * 2, itemsPerRing * 3), tiltX: 5, radius: 245, dur: 25, rev: false },
    { items: allSkills.slice(itemsPerRing * 3), tiltX: -25, radius: 250, dur: 20, rev: true },
  ];

  return (
    <div className="sg-wrapper">
      <div className="sg-scene">
        <div className="sg-inner">
          {rings.map((r, i) => (
            <div key={`el-${i}`} className="sg-ellipse"
              style={{ transform: `translate(-50%, -50%) rotateX(${r.tiltX}deg)`,
                       width: `${r.radius * 2 + 100}px`,
                       height: `${r.radius * 2 + 100}px` }} />
          ))}

          {rings.map((ring, ri) => (
            <div key={`ring-${ri}`} className="sg-tilt"
              style={{ '--tiltX': `${ring.tiltX}deg` }}>
              <div className="sg-spin"
                style={{
                  animationDuration: `${ring.dur}s`,
                  animationDirection: ring.rev ? 'reverse' : 'normal'
                }}>
                {ring.items.map((skill, si) => (
                  <div key={`${skill.key}-${si}`} className="sg-item-arm"
                    style={{ transform: `rotateY(${si * (360 / ring.items.length)}deg) translateZ(${ring.radius}px)` }}>
                    <div className="sg-item">
                      <div className="sg-logo">{logos[skill.key]}</div>
                      <span className="sg-name">{skill.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sg-soft-skills">
        {['Agile / Scrum', 'Sprint Collaboration', 'Team Coordination', 'Analytical Thinking',
          'Problem Solving', 'Leadership', 'Adaptability', 'Deadline Management'].map(s => (
          <span key={s} className="sg-soft-chip">{s}</span>
        ))}
      </div>
    </div>
  );
};

export default SkillGlobe;
