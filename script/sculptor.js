const starCanvas = document.getElementById('stars-canvas');
const starCtx = starCanvas.getContext('2d');
let starField = [];
const STAR_COUNT = 200;

function initStars() {
    starField = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        starField.push({
            x: Math.random() * starCanvas.width,
            y: Math.random() * starCanvas.height,
            radius: Math.random() * 2 + 0.8,
            alpha: Math.random() * 0.5 + 0.2,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.2 + 0.15,
            twinkle: Math.random() * 0.05 + 0.01,
        });
    }
}

function resizeStars() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
    initStars();
}

function drawStars() {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    starCtx.fillStyle = '#150B0A';
    starCtx.fillRect(0, 0, starCanvas.width, starCanvas.height);
    for (const s of starField) {
        starCtx.beginPath();
        starCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        const twinkle = 0.6 + 0.4 * Math.sin(Date.now() * 0.002 * s.twinkle * 10);
        const opacity = Math.min(s.alpha * twinkle, 0.9);
        starCtx.fillStyle = `rgba(255, 235, 190, ${opacity})`;
        starCtx.fill();
    }
}

function updateStars() {
    for (const s of starField) {
        s.x += s.speedX;
        s.y += s.speedY;
        if (s.x < -20) s.x = starCanvas.width + 20;
        if (s.x > starCanvas.width + 20) s.x = -20;
        if (s.y < -20) s.y = starCanvas.height + 20;
        if (s.y > starCanvas.height + 20) s.y = -20;
        s.radius = Math.max(0.7, Math.min(2.4, s.radius + (Math.random() - 0.5) * 0.03));
    }
}

function animateStars() {
    updateStars();
    drawStars();
    requestAnimationFrame(animateStars);
}

window.addEventListener('resize', resizeStars);
resizeStars();
animateStars();

// ===== THREE.JS СКУЛЬПТОР =====
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('sculptor-canvas');
const wrapper = document.getElementById('sculptorWrapper');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a100e);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(5, 3.5, 6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 1.2;
controls.zoomSpeed = 1.2;
controls.enabled = false;

// ===== СВЕТ =====
const ambientLight = new THREE.AmbientLight(0x604040);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffeedd, 1.2);
dirLight.position.set(3, 5, 2);
scene.add(dirLight);
const fillLight = new THREE.PointLight(0xaa8866, 0.5);
fillLight.position.set(0, -2, 0);
scene.add(fillLight);
const rimLight = new THREE.PointLight(0xffaa66, 0.6);
rimLight.position.set(-2, 1, -3);
scene.add(rimLight);
const warmFill = new THREE.PointLight(0xff9966, 0.4);
warmFill.position.set(2, 1.5, 2);
scene.add(warmFill);

// ===== ДЕКОРАТИВНЫЕ ЭЛЕМЕНТЫ =====
const gridHelper = new THREE.GridHelper(12, 20, 0x8B6F50, 0x5A3F2E);
gridHelper.position.y = -2.2;
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.25;
scene.add(gridHelper);

const particleGeo = new THREE.BufferGeometry();
const particleCount = 600;
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 18;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8 - 1;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 4;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleMat = new THREE.PointsMaterial({ color: 0xccaa88, size: 0.04, transparent: true, opacity: 0.2 });
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// ===== ОСНОВНАЯ СФЕРА ДЛЯ ЛЕПКИ =====
const geometry = new THREE.SphereGeometry(2.0, 96, 96);
const material = new THREE.MeshStandardMaterial({
    color: 0xd6ae7a,
    roughness: 0.35,
    metalness: 0.05,
    emissive: 0x332200,
    emissiveIntensity: 0.12,
});
const sculptureMesh = new THREE.Mesh(geometry, material);
sculptureMesh.castShadow = true;
scene.add(sculptureMesh);

const positionAttribute = geometry.attributes.position;
const originalPositions = positionAttribute.array.slice();

// ===== КИСТЬ-КОЛЬЦО =====
const ringGeometry = new THREE.RingGeometry(0.25, 0.45, 32);
const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa55,
    emissive: 0x442200,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
});
const brushRing = new THREE.Mesh(ringGeometry, ringMaterial);
brushRing.rotation.x = -Math.PI / 2;
brushRing.scale.set(1, 1, 1);
scene.add(brushRing);
brushRing.visible = false;

// ===== СОСТОЯНИЕ ЛЕПКИ =====
let sculptActive = false;
let sculptModeEnabled = true;
let currentMode = "pull";
let brushRadius = 0.55;
let strength = 0.065;

const raycaster = new THREE.Raycaster();
const mouseCoords = new THREE.Vector2();

function updateGeometryAfterSculpt() {
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
}

function resetSculpture() {
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < originalPositions.length; i++) {
        positions[i] = originalPositions[i];
    }
    updateGeometryAfterSculpt();
}

function applySculptAtPoint(hitPointWorld, isPull) {
    if (!sculptureMesh) return;
    const localHit = sculptureMesh.worldToLocal(hitPointWorld.clone());
    const positions = geometry.attributes.position.array;
    const vertex = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const count = positions.length / 3;
    const radiusSq = brushRadius * brushRadius;
    const strVal = strength;
    let changed = false;

    for (let i = 0; i < count; i++) {
        vertex.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        const dx = vertex.x - localHit.x;
        const dy = vertex.y - localHit.y;
        const dz = vertex.z - localHit.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            let falloff = 1.0 - (dist / brushRadius);
            falloff = Math.pow(falloff, 1.2);
            let offsetMagnitude = strVal * falloff;
            if (!isPull) offsetMagnitude = -offsetMagnitude;
            direction.copy(vertex).normalize();
            vertex.x += direction.x * offsetMagnitude;
            vertex.y += direction.y * offsetMagnitude;
            vertex.z += direction.z * offsetMagnitude;
            positions[i * 3] = vertex.x;
            positions[i * 3 + 1] = vertex.y;
            positions[i * 3 + 2] = vertex.z;
            changed = true;
        }
    }
    if (changed) updateGeometryAfterSculpt();
}

// ===== СОБЫТИЯ МЫШИ ДЛЯ ЛЕПКИ =====
function onMouseMoveForSculpt(event) {
    if (!sculptActive || !sculptModeEnabled) return;
    const rect = renderer.domElement.getBoundingClientRect();
    mouseCoords.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseCoords.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouseCoords, camera);
    const intersects = raycaster.intersectObject(sculptureMesh);
    if (intersects.length > 0) {
        const hit = intersects[0];
        const hitPoint = hit.point;
        brushRing.position.copy(hitPoint);
        brushRing.visible = true;
        const scaleFac = brushRadius / 0.55;
        brushRing.scale.set(scaleFac, scaleFac, 1);
        const isPullMode = (currentMode === "pull");
        applySculptAtPoint(hitPoint, isPullMode);
    } else {
        brushRing.visible = false;
    }
}

function onMouseDownSculpt(event) {
    if (!sculptModeEnabled) return;
    if (event.button === 0) {
        sculptActive = true;
        event.preventDefault();
        onMouseMoveForSculpt(event);
    }
}

function onMouseUpSculpt() {
    sculptActive = false;
    brushRing.visible = false;
}

const canvasEl = renderer.domElement;
canvasEl.addEventListener('mousemove', onMouseMoveForSculpt);
canvasEl.addEventListener('mousedown', onMouseDownSculpt);
window.addEventListener('mouseup', onMouseUpSculpt);
canvasEl.addEventListener('contextmenu', (e) => {
    if (sculptModeEnabled) e.preventDefault();
});


const modePullBtn = document.getElementById('modePullBtn');
const modePushBtn = document.getElementById('modePushBtn');
const radiusSlider = document.getElementById('brushRadius');
const radiusVal = document.getElementById('radiusVal');
const strengthSlider = document.getElementById('strengthSlider');
const strengthVal = document.getElementById('strengthVal');
const resetBtn = document.getElementById('resetBtn');
const toggleSculptBtn = document.getElementById('toggleSculptBtn');

modePullBtn.addEventListener('click', () => {
    currentMode = "pull";
    modePullBtn.classList.add('mode-active');
    modePushBtn.classList.remove('mode-active');
});

modePushBtn.addEventListener('click', () => {
    currentMode = "push";
    modePushBtn.classList.add('mode-active');
    modePullBtn.classList.remove('mode-active');
});

radiusSlider.addEventListener('input', (e) => {
    brushRadius = parseFloat(e.target.value);
    radiusVal.innerText = brushRadius.toFixed(2);
});

strengthSlider.addEventListener('input', (e) => {
    strength = parseFloat(e.target.value);
    strengthVal.innerText = strength.toFixed(3);
});

resetBtn.addEventListener('click', resetScul