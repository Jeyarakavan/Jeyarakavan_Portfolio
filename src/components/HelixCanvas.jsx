import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HelixCanvas = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const wrap = containerRef.current;
    const canvas = canvasRef.current;
    
    let w = wrap.clientWidth || 300;
    let h = wrap.clientHeight || 300;
    
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.z = 5;

    // Central DNA-like double helix
    const curve1Points = [];
    const curve2Points = [];
    const pointsCount = 200;

    for (let i = 0; i < pointsCount; i++) {
      const t = (i / pointsCount) * Math.PI * 6 - Math.PI * 3;
      curve1Points.push(new THREE.Vector3(Math.cos(t) * 1.2, t * 0.25, Math.sin(t) * 1.2));
      curve2Points.push(new THREE.Vector3(Math.cos(t + Math.PI) * 1.2, t * 0.25, Math.sin(t + Math.PI) * 1.2));
    }

    const hGeo1 = new THREE.BufferGeometry().setFromPoints(curve1Points);
    const hGeo2 = new THREE.BufferGeometry().setFromPoints(curve2Points);

    const hMat1 = new THREE.LineBasicMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.75 });
    const hMat2 = new THREE.LineBasicMaterial({ color: 0x8b7aff, transparent: true, opacity: 0.75 });

    const helix1 = new THREE.Line(hGeo1, hMat1);
    const helix2 = new THREE.Line(hGeo2, hMat2);
    
    scene.add(helix1);
    scene.add(helix2);

    // Connecting rungs
    const rungs = [];
    const rungsCount = 30;
    const rungMat = new THREE.LineBasicMaterial({ color: 0x64d9b8, transparent: true, opacity: 0.35 });

    for (let i = 0; i < rungsCount; i++) {
      const t = (i / rungsCount) * Math.PI * 6 - Math.PI * 3;
      const p1 = new THREE.Vector3(Math.cos(t) * 1.2, t * 0.25, Math.sin(t) * 1.2);
      const p2 = new THREE.Vector3(Math.cos(t + Math.PI) * 1.2, t * 0.25, Math.sin(t + Math.PI) * 1.2);
      
      const rGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const rungLine = new THREE.Line(rGeo, rungMat);
      scene.add(rungLine);
      rungs.push(rungLine);
    }

    // Ambient floating particles
    const pCount = 100;
    const pGeo = new THREE.BufferGeometry();
    const pts = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
      pts[i] = (Math.random() - 0.5) * 8;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    
    const pMat = new THREE.PointsMaterial({ 
      size: 0.04, 
      color: 0xc9a96e, 
      transparent: true, 
      opacity: 0.5 
    });
    
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Resize observer to handle dynamic changes
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const newW = entry.contentRect.width || 300;
      const newH = entry.contentRect.height || 300;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(wrap);

    let animationFrameId;
    let t = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      t += 0.008;

      helix1.rotation.y = t * 0.4;
      helix2.rotation.y = t * 0.4;
      
      rungs.forEach((r) => {
        r.rotation.y = t * 0.4;
      });

      particles.rotation.y = t * 0.1;
      particles.rotation.x = t * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      
      // Clean up geometries and materials
      hGeo1.dispose();
      hGeo2.dispose();
      hMat1.dispose();
      hMat2.dispose();
      rungMat.dispose();
      
      rungs.forEach(r => {
        r.geometry.dispose();
      });
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      className="about-3d-helix" 
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
};

export default HelixCanvas;
