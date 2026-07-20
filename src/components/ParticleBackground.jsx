import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = 60;

    // Stars / particles
    const pCount = 2000;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    const colors = new Float32Array(pCount * 3);
    const colorChoices = [
      [0.788, 0.663, 0.431], // gold: #c9a96e
      [0.545, 0.478, 1.0],   // purple: #8b7aff
      [0.392, 0.851, 0.722]  // teal: #64d9b8
    ];

    for (let i = 0; i < pCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 150;
      
      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = c[0]; 
      colors[i * 3 + 1] = c[1]; 
      colors[i * 3 + 2] = c[2];
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const pMat = new THREE.PointsMaterial({ 
      size: 0.3, 
      vertexColors: true, 
      transparent: true, 
      opacity: 0.7 
    });
    
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Floating wireframe spheres
    const spheres = [];
    const sphereData = [
      { r: 12, pos: [30, 10, -30], col: 0xc9a96e, spd: 0.002 },
      { r: 8,  pos: [-28, -8, -20], col: 0x8b7aff, spd: 0.003 },
      { r: 5,  pos: [10, -20, -10], col: 0x64d9b8, spd: 0.004 }
    ];

    sphereData.forEach(d => {
      const geo = new THREE.IcosahedronGeometry(d.r, 1);
      const mat = new THREE.MeshBasicMaterial({ 
        color: d.col, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.12 
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...d.pos);
      mesh.userData = { spd: d.spd };
      scene.add(mesh);
      spheres.push(mesh);
    });

    // Floating torus
    const torusGeo = new THREE.TorusGeometry(15, 0.3, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({ 
      color: 0xc9a96e, 
      transparent: true, 
      opacity: 0.08 
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(-20, 5, -40);
    scene.add(torus);

    // Mouse parallax variables
    let mx = 0;
    let my = 0;

    const handleMouseMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    let t = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      t += 0.008;
      
      particles.rotation.y = t * 0.03;
      particles.rotation.x = t * 0.01;
      
      spheres.forEach((s, i) => {
        s.rotation.x += s.userData.spd;
        s.rotation.y += s.userData.spd * 1.3;
        s.position.y += Math.sin(t + i * 1.2) * 0.015;
      });

      torus.rotation.x = t * 0.2;
      torus.rotation.z = t * 0.1;

      // Parallax smooth camera movement
      camera.position.x += (mx * 6 - camera.position.x) * 0.03;
      camera.position.y += (-my * 4 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Dispose resources
      pGeo.dispose();
      pMat.dispose();
      spheres.forEach(s => {
        s.geometry.dispose();
        s.material.dispose();
      });
      torusGeo.dispose();
      torusMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas id="bg-canvas" ref={canvasRef} />;
};

export default ParticleBackground;
