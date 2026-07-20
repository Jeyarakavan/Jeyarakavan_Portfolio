import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// A lightweight, self-contained 3D animation canvas for each project thumb
const Project3DCanvas = ({ shapeType, colorTheme, isHovered }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const w = container.clientWidth || 200;
    const h = container.clientHeight || 200;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50);
    camera.position.z = 8;

    // Determine geometry based on shapeType
    let geometry;
    switch (shapeType) {
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(2, 0);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(1.5, 0.4, 8, 24);
        break;
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(2, 1);
        break;
      case 'box':
        geometry = new THREE.BoxGeometry(2, 2, 2);
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry(1.8, 2.5, 4);
        break;
      default:
        geometry = new THREE.TorusKnotGeometry(1.2, 0.3, 50, 8);
    }

    // Determine color based on colorTheme
    let colorVal;
    if (colorTheme === 'gold') colorVal = 0xc9a96e;
    else if (colorTheme === 'teal') colorVal = 0x64d9b8;
    else colorVal = 0x8b7aff; // purple

    // Material with wireframe
    const material = new THREE.MeshBasicMaterial({
      color: colorVal,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Let's add an inner solid mesh with low opacity
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: colorVal,
      transparent: true,
      opacity: 0.05
    });
    const innerMesh = new THREE.Mesh(geometry, innerMaterial);
    innerMesh.scale.setScalar(0.95);
    scene.add(innerMesh);

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const newW = entries[0].contentRect.width || 200;
      const newH = entries[0].contentRect.height || 200;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    let animationFrameId;
    let t = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Speed up rotation when hovered
      const speed = isHovered ? 0.025 : 0.008;
      t += speed;

      mesh.rotation.x = t;
      mesh.rotation.y = t * 1.5;
      
      innerMesh.rotation.x = t;
      innerMesh.rotation.y = t * 1.5;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      innerMaterial.dispose();
      renderer.dispose();
    };
  }, [shapeType, colorTheme, isHovered]);

  return (
    <div ref={containerRef} className="proj-3d-canvas-container" style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
};

export const ProjectCard = ({ title, desc, stack, label, labelType, shapeType, colorTheme, liveUrl, githubUrl, cardClass }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');
  const [transition, setTransition] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate coordinates
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    
    const maxTilt = 12;
    const rotX = -y * maxTilt;
    const rotY = x * maxTilt;

    setTransform(`translateY(-12px) rotateX(${rotX}deg) rotateY(${rotY}deg)`);
    setTransition('none');
  };

  const handleMouseLeave = () => {
    setTransform('');
    setTransition('transform .4s, border-color .4s, box-shadow .4s');
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      className={`proj-card ${cardClass} reveal`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition }}
    >
      <div className="proj-thumb">
        <div className="overlay"></div>
        {/* Dynamic Interactive 3D Mesh */}
        <Project3DCanvas shapeType={shapeType} colorTheme={colorTheme} isHovered={isHovered} />
        
        <div className={`proj-thumb-label ${labelType}-label`}>{label}</div>
      </div>
      
      <div className="proj-body">
        <h3 className="proj-title">{title}</h3>
        <p className="proj-desc">{desc}</p>
        
        <div className="proj-stack">
          {stack.map((item, idx) => (
            <span key={idx} className="p-chip">{item}</span>
          ))}
        </div>
        
        <div className="proj-links">
          {liveUrl && (
            <a href={liveUrl} className="plink" target="_blank" rel="noopener noreferrer">
              → Live Demo
            </a>
          )}
          {githubUrl && (
            <a href={githubUrl} className="plink" target="_blank" rel="noopener noreferrer">
              → GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
