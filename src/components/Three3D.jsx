import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

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
    const animate = () => {
      id = requestAnimationFrame(animate);
      t += 0.004;
      mat.opacity = 0.7 + Math.sin(t*1.5)*0.12;
      nebulae.forEach(n=>{ n.rotation.y+=n._spd; n.rotation.x+=n._spd*0.7; });
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
