import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ── Night Sky Star Background ── */
export const StarBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.z = 80;

    /* Stars */
    const starCount = 1800;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(starCount * 3);
    const col = new Float32Array(starCount * 3);
    const bluePalette = [
      [0.24, 0.51, 0.98],[0.37, 0.65, 1.0],[0.04, 0.71, 0.83],[0.49, 0.78, 1.0],[0.13, 0.33, 0.71]
    ];
    for (let i = 0; i < starCount; i++) {
      pos[i*3] = (Math.random()-0.5)*320;
      pos[i*3+1] = (Math.random()-0.5)*320;
      pos[i*3+2] = (Math.random()-0.5)*200;
      const c = bluePalette[Math.floor(Math.random()*bluePalette.length)];
      col[i*3]=c[0]; col[i*3+1]=c[1]; col[i*3+2]=c[2];
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 0.35, vertexColors: true, transparent: true, opacity: 0.85 });
    scene.add(new THREE.Points(geo, mat));

    /* Nebula wisps */
    const nebulae = [];
    [{ col: 0x1e3a8a, r: 18, pos: [40, 20, -60] },
     { col: 0x0e7490, r: 12, pos: [-35, -15, -45] },
     { col: 0x1d4ed8, r: 8,  pos: [10, -28, -30] }
    ].forEach(d => {
      const g = new THREE.IcosahedronGeometry(d.r, 1);
      const m = new THREE.MeshBasicMaterial({ color: d.col, wireframe: true, transparent: true, opacity: 0.07 });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(...d.pos);
      mesh._spd = Math.random()*0.003+0.001;
      scene.add(mesh);
      nebulae.push(mesh);
    });

    let mx=0, my=0;
    const onMove = e => { mx=(e.clientX/window.innerWidth-0.5)*2; my=(e.clientY/window.innerHeight-0.5)*2; };
    const onResize = () => {
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);

    let id, t=0;
    const pts = geo.attributes.position.array;
    const animate = () => {
      id = requestAnimationFrame(animate);
      t += 0.004;
      // Gentle star twinkle via opacity
      mat.opacity = 0.7 + Math.sin(t*1.5)*0.12;
      nebulae.forEach((n,i)=>{ n.rotation.y+=n._spd; n.rotation.x+=n._spd*0.7; });
      camera.position.x += (mx*4-camera.position.x)*0.025;
      camera.position.y += (-my*3-camera.position.y)*0.025;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      geo.dispose(); mat.dispose();
      nebulae.forEach(n=>{ n.geometry.dispose(); n.material.dispose(); });
      renderer.dispose();
    };
  }, []);
  return <canvas id="star-canvas" ref={canvasRef} />;
};

/* ── Hero 3D Programmer Scene ── */
export const ProgrammerScene = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth || 560, h = canvas.clientHeight || 440;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 100);
    camera.position.set(0, 3, 14);
    camera.lookAt(0, 1, 0);

    /* Lighting */
    scene.add(new THREE.AmbientLight(0x0a1628, 0.8));
    const point1 = new THREE.PointLight(0x3b82f6, 6, 25);
    point1.position.set(-4, 5, 4);
    scene.add(point1);
    const point2 = new THREE.PointLight(0x06b6d4, 4, 20);
    point2.position.set(4, 3, -2);
    scene.add(point2);
    const rimLight = new THREE.PointLight(0x1e3a8a, 3, 30);
    rimLight.position.set(0, 8, -8);
    scene.add(rimLight);

    /* Desk surface */
    const deskGeo = new THREE.BoxGeometry(10, 0.18, 4);
    const deskMat = new THREE.MeshPhongMaterial({ color: 0x0d1b3e, shininess: 30 });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, 0, 0);
    desk.receiveShadow = true;
    scene.add(desk);

    /* Monitor frames */
    const makeMonitor = (x, angle, scale=1) => {
      const group = new THREE.Group();
      const bezels = new THREE.Mesh(
        new THREE.BoxGeometry(3.4*scale, 2.1*scale, 0.1),
        new THREE.MeshPhongMaterial({ color: 0x0a0f1e, shininess: 10 })
      );
      group.add(bezels);

      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(3.1*scale, 1.85*scale, 0.05),
        new THREE.MeshPhongMaterial({ color: 0x030820, emissive: 0x1a3a7a, emissiveIntensity: 0.4, shininess: 120 })
      );
      screen.position.z = 0.05;
      group.add(screen);

      /* Code lines on screen */
      const lineColors = [0x60a5fa, 0x06b6d4, 0xc4b5fd, 0x86efac, 0x60a5fa, 0xfbbf24];
      for (let i = 0; i < 10; i++) {
        const len = (0.3+Math.random()*0.9)*scale;
        const lineGeo = new THREE.PlaneGeometry(len, 0.05*scale);
        const lineMat = new THREE.MeshBasicMaterial({ color: lineColors[i%lineColors.length], transparent: true, opacity: 0.7 });
        const line = new THREE.Mesh(lineGeo, lineMat);
        line.position.set((-1.2+(len/2))*scale, (0.8 - i*0.18)*scale, 0.08);
        line.userData.baseOpacity = 0.5 + Math.random()*0.4;
        line.userData.phase = Math.random()*Math.PI*2;
        screen.add(line);
      }

      /* Stand */
      const standGeo = new THREE.CylinderGeometry(0.06, 0.12, 0.8*scale, 8);
      const stand = new THREE.Mesh(standGeo, new THREE.MeshPhongMaterial({ color: 0x0a0f1e }));
      stand.position.y = (-1.25*scale);
      group.add(stand);

      const baseGeo = new THREE.BoxGeometry(1.2*scale, 0.07, 0.6*scale);
      const base = new THREE.Mesh(baseGeo, new THREE.MeshPhongMaterial({ color: 0x0a0f1e }));
      base.position.y = -1.64*scale;
      group.add(base);

      group.position.set(x, 1.58*scale, -0.5);
      group.rotation.y = angle;
      group.castShadow = true;
      return group;
    };

    const monitor1 = makeMonitor(-3.2, 0.35);   // left screen, angled in
    const monitor2 = makeMonitor(0, 0, 1.12);    // main center, bigger
    const monitor3 = makeMonitor(3.2, -0.35);    // right screen, angled in
    scene.add(monitor1, monitor2, monitor3);

    /* Keyboard */
    const kbGeo = new THREE.BoxGeometry(3.2, 0.07, 1.1);
    const kbMat = new THREE.MeshPhongMaterial({ color: 0x080d1a, shininess: 40 });
    const keyboard = new THREE.Mesh(kbGeo, kbMat);
    keyboard.position.set(0, 0.12, 1.2);
    /* Key rows */
    for (let r=0; r<4; r++) {
      for (let c=0; c<11; c++) {
        const key = new THREE.Mesh(
          new THREE.BoxGeometry(0.22, 0.04, 0.22),
          new THREE.MeshPhongMaterial({ color: 0x101828, shininess: 60 })
        );
        key.position.set(-1.2+c*0.26, 0.09, r*0.24-0.36);
        keyboard.add(key);
      }
    }
    scene.add(keyboard);

    /* Glowing orb */
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16),
      new THREE.MeshPhongMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 1.2, transparent: true, opacity: 0.9 })
    );
    orb.position.set(-4.5, 1.2, 0);
    scene.add(orb);
    const orbLight = new THREE.PointLight(0x3b82f6, 3, 6);
    orbLight.position.copy(orb.position);
    scene.add(orbLight);

    /* Coffee mug */
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.18, 0.5, 12),
      new THREE.MeshPhongMaterial({ color: 0x1e3a8a, shininess: 60 })
    );
    mug.position.set(4.2, 0.28, 0.6);
    scene.add(mug);

    /* Particle typing effect (dots floating up from keyboard) */
    const typingParticles = [];
    const createTypingParticle = () => {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.9 })
      );
      dot.position.set((Math.random()-0.5)*3, 0.25, 1.0+(Math.random()-0.5)*0.8);
      dot.userData = { vy: 0.012+Math.random()*0.02, life: 0, maxLife: 60+Math.random()*40 };
      scene.add(dot);
      typingParticles.push(dot);
    };
    let particleTimer = 0;

    /* Collect all screen lines for animation */
    const allScreenLines = [];
    [monitor1, monitor2, monitor3].forEach(mon => {
      mon.children[1].children.forEach(line => allScreenLines.push(line));
    });

    const onResize = () => {
      const nw = canvas.clientWidth || 560, nh = canvas.clientHeight || 440;
      camera.aspect = nw/nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    let id, t=0;
    const animate = () => {
      id = requestAnimationFrame(animate);
      t += 0.012;

      /* Monitor glow pulse */
      [monitor1, monitor2, monitor3].forEach((mon, mi) => {
        const screen = mon.children[1];
        screen.material.emissiveIntensity = 0.35 + Math.sin(t*1.2 + mi*1.3)*0.12;
      });

      /* Animate code lines */
      allScreenLines.forEach(line => {
        line.material.opacity = line.userData.baseOpacity * (0.6+Math.sin(t*2+line.userData.phase)*0.4);
      });

      /* Camera gentle sway */
      camera.position.x = Math.sin(t*0.25)*0.4;
      camera.position.y = 3 + Math.cos(t*0.2)*0.15;
      camera.lookAt(0, 1.2, 0);

      /* Orb pulse */
      orb.material.emissiveIntensity = 1.0+Math.sin(t*2.5)*0.4;
      orbLight.intensity = 3+Math.sin(t*2.5)*1;

      /* Typing particles */
      particleTimer++;
      if (particleTimer % 12 === 0) createTypingParticle();
      for (let i = typingParticles.length-1; i >= 0; i--) {
        const p = typingParticles[i];
        p.position.y += p.userData.vy;
        p.userData.life++;
        p.material.opacity = Math.max(0, 1 - p.userData.life/p.userData.maxLife);
        if (p.userData.life >= p.userData.maxLife) {
          scene.remove(p);
          p.geometry.dispose();
          p.material.dispose();
          typingParticles.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);
  return <canvas ref={canvasRef} id="hero-canvas" />;
};

/* ── Project Thumbnail 3D Canvas ── */
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

    /* Ambient particles */
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
