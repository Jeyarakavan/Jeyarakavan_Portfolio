import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Create an intense, shining optical lens-flare star texture with diffraction spikes
function createBrightStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Multi-tier intense radial starlight core
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.08, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(224, 242, 254, 0.85)');
  gradient.addColorStop(0.4, 'rgba(56, 189, 248, 0.4)');
  gradient.addColorStop(0.7, 'rgba(37, 99, 235, 0.12)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  // Brilliant 4-point cross diffraction star spikes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(64, 8);
  ctx.lineTo(64, 120);
  ctx.moveTo(8, 64);
  ctx.lineTo(120, 64);
  ctx.stroke();

  // Diagonal subtle secondary spikes for sparkle
  ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(28, 28);
  ctx.lineTo(100, 100);
  ctx.moveTo(28, 100);
  ctx.lineTo(100, 28);
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

export const StarBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 85;

    const starTexture = createBrightStarTexture();

    // 1. Vast Deep Background Starfield (3200 stars)
    const bgStarCount = 3200;
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = new Float32Array(bgStarCount * 3);
    const bgCol = new Float32Array(bgStarCount * 3);
    const starPalette = [
      [1.0, 1.0, 1.0],       // Diamond Pure White
      [0.85, 0.94, 1.0],     // Crystal Ice Blue
      [0.65, 0.85, 1.0],     // Electric Cyan Starlight
      [1.0, 0.98, 0.92],     // Warm White
      [0.55, 0.8, 1.0]       // Vibrant Sky Blue
    ];
    for (let i = 0; i < bgStarCount; i++) {
      bgPos[i * 3] = (Math.random() - 0.5) * 550;
      bgPos[i * 3 + 1] = (Math.random() - 0.5) * 550;
      bgPos[i * 3 + 2] = (Math.random() - 0.5) * 450;
      const c = starPalette[Math.floor(Math.random() * starPalette.length)];
      bgCol[i * 3] = c[0]; bgCol[i * 3 + 1] = c[1]; bgCol[i * 3 + 2] = c[2];
    }
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    bgGeo.setAttribute('color', new THREE.BufferAttribute(bgCol, 3));
    const bgMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      map: starTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    scene.add(new THREE.Points(bgGeo, bgMat));

    // 2. Ultra-Bright Shining & Twinkling Space Stars (280 prominent stars)
    const shiningCount = 280;
    const shiningGeo = new THREE.BufferGeometry();
    const shiningPos = new Float32Array(shiningCount * 3);
    const shiningCol = new Float32Array(shiningCount * 3);
    const shiningSpeeds = [];

    for (let i = 0; i < shiningCount; i++) {
      shiningPos[i * 3] = (Math.random() - 0.5) * 380;
      shiningPos[i * 3 + 1] = (Math.random() - 0.5) * 380;
      shiningPos[i * 3 + 2] = (Math.random() - 0.5) * 220;

      // Pure radiant white-cyan brilliance
      const isCyan = Math.random() > 0.5;
      shiningCol[i * 3] = isCyan ? 0.8 : 1.0;
      shiningCol[i * 3 + 1] = isCyan ? 0.95 : 1.0;
      shiningCol[i * 3 + 2] = 1.0;

      shiningSpeeds.push({
        phase: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 3.5,
        baseSize: 3.5 + Math.random() * 3.0
      });
    }
    shiningGeo.setAttribute('position', new THREE.BufferAttribute(shiningPos, 3));
    shiningGeo.setAttribute('color', new THREE.BufferAttribute(shiningCol, 3));

    const shiningMat = new THREE.PointsMaterial({
      size: 4.2,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      map: starTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const shiningStars = new THREE.Points(shiningGeo, shiningMat);
    scene.add(shiningStars);

    // 3. Dynamic Shooting Star / Meteor Effect
    const shootGeo = new THREE.BufferGeometry();
    const shootPos = new Float32Array(6); // line of 2 points
    shootGeo.setAttribute('position', new THREE.BufferAttribute(shootPos, 3));
    const shootMat = new THREE.LineBasicMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0,
      linewidth: 2,
      blending: THREE.AdditiveBlending
    });
    const shootingStar = new THREE.Line(shootGeo, shootMat);
    scene.add(shootingStar);

    let shootActive = false;
    let shootProgress = 0;
    let shootOrigin = { x: 0, y: 0, z: 0 };
    let shootDir = { x: -1.2, y: -0.8, z: 0 };

    const triggerShootingStar = () => {
      shootOrigin = {
        x: (Math.random() - 0.3) * 250,
        y: 80 + Math.random() * 60,
        z: -20 - Math.random() * 40
      };
      shootProgress = 0;
      shootActive = true;
    };

    // Trigger meteor every 3.5 - 6 seconds
    const shootInterval = setInterval(() => {
      if (!shootActive) triggerShootingStar();
    }, 4200);

    // 4. Subtle Ambient Deep Space Meshes
    const nebulae = [];
    [{ col: 0x1d4ed8, r: 24, pos: [50, 25, -60], op: 0.05 },
     { col: 0x0284c7, r: 18, pos: [-45, -25, -45], op: 0.04 },
     { col: 0x38bdf8, r: 12, pos: [15, -35, -30], op: 0.035 }
    ].forEach(d => {
      const g = new THREE.IcosahedronGeometry(d.r, 1);
      const m = new THREE.MeshBasicMaterial({ color: d.col, wireframe: true, transparent: true, opacity: d.op });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(...d.pos);
      mesh._spd = Math.random() * 0.002 + 0.001;
      scene.add(mesh);
      nebulae.push(mesh);
    });

    let mx = 0, my = 0;
    const onMove = e => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);

    let id, t = 0;
    const animate = () => {
      id = requestAnimationFrame(animate);
      t += 0.015;

      // Twinkle pulsation for shining stars - bright, radiant shimmer
      shiningMat.size = 3.6 + Math.sin(t * 2.5) * 1.2;
      shiningMat.opacity = 0.88 + Math.sin(t * 1.8) * 0.12;

      // Background stars slow glimmer
      bgMat.opacity = 0.9 + Math.sin(t * 0.9) * 0.1;

      // Animate Shooting Star
      if (shootActive) {
        shootProgress += 0.035;
        const headX = shootOrigin.x + shootDir.x * shootProgress * 70;
        const headY = shootOrigin.y + shootDir.y * shootProgress * 70;
        const tailX = shootOrigin.x + shootDir.x * Math.max(0, shootProgress - 0.25) * 70;
        const tailY = shootOrigin.y + shootDir.y * Math.max(0, shootProgress - 0.25) * 70;

        const pArr = shootGeo.attributes.position.array;
        pArr[0] = headX; pArr[1] = headY; pArr[2] = shootOrigin.z;
        pArr[3] = tailX; pArr[4] = tailY; pArr[5] = shootOrigin.z;
        shootGeo.attributes.position.needsUpdate = true;

        shootMat.opacity = Math.sin(shootProgress * Math.PI) * 0.9;

        if (shootProgress >= 1) {
          shootActive = false;
          shootMat.opacity = 0;
        }
      }

      nebulae.forEach(n => {
        n.rotation.y += n._spd;
        n.rotation.x += n._spd * 0.6;
      });

      // Smooth camera parallax
      camera.position.x += (mx * 6 - camera.position.x) * 0.02;
      camera.position.y += (-my * 5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(id);
      clearInterval(shootInterval);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      bgGeo.dispose(); bgMat.dispose();
      shiningGeo.dispose(); shiningMat.dispose();
      shootGeo.dispose(); shootMat.dispose();
      starTexture.dispose();
      nebulae.forEach(n => { n.geometry.dispose(); n.material.dispose(); });
      renderer.dispose();
    };
  }, []);
  return <canvas id="star-canvas" ref={canvasRef} />;
};

export const ProgrammerScene = () => {
  return (
    <div className="hero-3d-scene-wrap">
      <div className="hero-3d-glow" />
      <div className="hero-3d-image-container">
        <img
          src="https://cdn3d.iconscout.com/3d/premium/thumb/web-developer-working-on-project-6343302-5242456.png"
          alt="Web Developer Working on Project"
          className="hero-3d-developer-img"
        />
        <div className="hero-3d-shadow" />
      </div>
    </div>
  );
};

export const ProjectCanvas = ({ color1 = 0x1e3a8a, color2 = 0x06b6d4, shape = 'torus' }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w=canvas.clientWidth||360, h=canvas.clientHeight||200;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(w, h);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w/h, 0.1, 50);
    camera.position.z = 5;

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pLight = new THREE.PointLight(color2, 4, 12);
    pLight.position.set(2,3,3);
    scene.add(pLight);

    let geo;
    if(shape==='torus') geo = new THREE.TorusKnotGeometry(1,0.3,64,8);
    else if(shape==='icosa') geo = new THREE.IcosahedronGeometry(1.5, 1);
    else if(shape==='box') geo = new THREE.BoxGeometry(1.8,1.8,1.8);
    else geo = new THREE.OctahedronGeometry(1.6,0);

    const mat = new THREE.MeshPhongMaterial({ color: color1, emissive: color2, emissiveIntensity: 0.3, wireframe: false, shininess: 80 });
    const wireMat = new THREE.MeshBasicMaterial({ color: color2, wireframe: true, transparent: true, opacity: 0.15 });
    const mesh = new THREE.Mesh(geo, mat);
    const wire = new THREE.Mesh(geo.clone(), wireMat);
    scene.add(mesh, wire);

    const pGeo = new THREE.BufferGeometry();
    const pts = new Float32Array(120*3);
    for(let i=0;i<120*3;i++) pts[i]=(Math.random()-0.5)*8;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pts,3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: color2, size: 0.04, transparent: true, opacity: 0.6 })));

    const onResize = () => {
      const nw=canvas.clientWidth||360, nh=canvas.clientHeight||200;
      camera.aspect=nw/nh; camera.updateProjectionMatrix(); renderer.setSize(nw,nh);
    };
    window.addEventListener('resize', onResize);

    let id, t=0;
    const animate = () => {
      id=requestAnimationFrame(animate); t+=0.012;
      mesh.rotation.x=t*0.5; mesh.rotation.y=t*0.7;
      wire.rotation.x=t*0.5; wire.rotation.y=t*0.7;
      pLight.intensity = 4+Math.sin(t*2)*1.5;
      renderer.render(scene, camera);
    };
    animate();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize',onResize); renderer.dispose(); };
  }, [color1, color2, shape]);
  return <canvas ref={canvasRef} className="proj-thumb-canvas" />;
};

export default StarBackground;

export const Hero3DRings = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth || 300;
    const h = canvas.clientHeight || 300;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 10;

    // Cyan Torus
    const cyanGeo = new THREE.TorusGeometry(2.2, 0.08, 32, 100);
    const cyanMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.9 });
    const cyanRing = new THREE.Mesh(cyanGeo, cyanMat);
    cyanRing.rotation.x = Math.PI / 3;
    scene.add(cyanRing);

    // Coral/Red Torus
    const coralGeo = new THREE.TorusGeometry(1.2, 0.06, 32, 100);
    const coralMat = new THREE.MeshBasicMaterial({ color: 0xff5a5f, transparent: true, opacity: 0.95 });
    const coralRing = new THREE.Mesh(coralGeo, coralMat);
    coralRing.position.set(0.5, 0.5, 0.2);
    coralRing.rotation.y = Math.PI / 4;
    scene.add(coralRing);

    // Cyan Solid Floating Dot
    const dotGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const cyanDot = new THREE.Mesh(dotGeo, dotMat);
    cyanDot.position.set(3, -1, -1);
    scene.add(cyanDot);

    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      const nw = canvas.clientWidth || 300;
      const nh = canvas.clientHeight || 300;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    let reqId, clock = new THREE.Clock();
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      cyanRing.rotation.z = elapsedTime * 0.3;
      cyanRing.rotation.y = elapsedTime * 0.2;
      coralRing.rotation.z = -elapsedTime * 0.4;
      coralRing.rotation.x = elapsedTime * 0.3;

      cyanDot.position.y = -1 + Math.sin(elapsedTime * 1.5) * 0.3;
      cyanDot.position.x = 3 + Math.cos(elapsedTime * 1.2) * 0.2;

      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cyanGeo.dispose(); cyanMat.dispose();
      coralGeo.dispose(); coralMat.dispose();
      dotGeo.dispose(); dotMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-3d-rings-canvas" />;
};

