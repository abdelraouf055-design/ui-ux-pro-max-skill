import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('bg-canvas');
if (!canvas) throw new Error('No #bg-canvas found');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion) {
  canvas.style.display = 'none';
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const particleCount = 200;
const positions = new Float32Array(particleCount * 3);
const velocities = [];

for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 60;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
  velocities.push({
    x: (Math.random() - 0.5) * 0.01,
    y: (Math.random() - 0.5) * 0.01,
    z: (Math.random() - 0.5) * 0.005
  });
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  color: 0xDC2626,
  size: 0.15,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

const torusGeo = new THREE.TorusKnotGeometry(8, 2.5, 100, 16);
const torusMat = new THREE.MeshBasicMaterial({
  color: 0x1E293B,
  wireframe: true,
  transparent: true,
  opacity: 0.12,
});
const torusKnot = new THREE.Mesh(torusGeo, torusMat);
torusKnot.position.set(15, -5, -10);
scene.add(torusKnot);

const ico1Geo = new THREE.IcosahedronGeometry(4, 1);
const ico1Mat = new THREE.MeshBasicMaterial({
  color: 0xDC2626,
  wireframe: true,
  transparent: true,
  opacity: 0.08,
});
const ico1 = new THREE.Mesh(ico1Geo, ico1Mat);
ico1.position.set(-18, 8, -5);
scene.add(ico1);

const ico2Geo = new THREE.OctahedronGeometry(3, 0);
const ico2Mat = new THREE.MeshBasicMaterial({
  color: 0x334155,
  wireframe: true,
  transparent: true,
  opacity: 0.1,
});
const ico2 = new THREE.Mesh(ico2Geo, ico2Mat);
ico2.position.set(-10, -12, -8);
scene.add(ico2);

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

let scrollY = 0;
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
});

function animate() {
  if (reducedMotion) return;
  requestAnimationFrame(animate);

  const pos = geometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    pos[i * 3] += velocities[i].x;
    pos[i * 3 + 1] += velocities[i].y;
    pos[i * 3 + 2] += velocities[i].z;

    if (Math.abs(pos[i * 3]) > 30) velocities[i].x *= -1;
    if (Math.abs(pos[i * 3 + 1]) > 30) velocities[i].y *= -1;
    if (Math.abs(pos[i * 3 + 2]) > 20) velocities[i].z *= -1;
  }
  geometry.attributes.position.needsUpdate = true;

  torusKnot.rotation.x += 0.002;
  torusKnot.rotation.y += 0.003;

  ico1.rotation.x += 0.003;
  ico1.rotation.z += 0.002;

  ico2.rotation.y += 0.004;
  ico2.rotation.z += 0.001;

  camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
  camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;

  const scrollFactor = scrollY * 0.001;
  particles.rotation.y = scrollFactor * 0.3;
  torusKnot.position.y = -5 + scrollFactor * 2;

  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
