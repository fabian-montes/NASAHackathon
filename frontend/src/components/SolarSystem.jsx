import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// --- Constants and Data (Unchanged) ---
const SOLAR_SYSTEM_DATA = [
    { name: 'sun', radius: 40, distance: 0, speed: 0, color: 0xffa500 },
    { name: "mercury", radius: 4, distance: 60, speed: 4.15, color: 0x8c7853 },
    { name: "venus", radius: 7, distance: 90, speed: 1.62, color: 0xffc649 },
    { name: "earth", radius: 8, distance: 120, speed: 1.00, color: 0x2233ff },
    { name: "mars", radius: 6, distance: 150, speed: 0.53, color: 0xcd5c5c },
    { name: "jupiter", radius: 20, distance: 210, speed: 0.08, color: 0xc88b3a },
    { name: "saturn", radius: 17, distance: 270, speed: 0.03, color: 0xfad5a5 },
    { name: "uranus", radius: 12, distance: 330, speed: 0.01, color: 0x4fd0e0 },
    { name: "neptune", radius: 12, distance: 380, speed: 0.006, color: 0x4166f5 },
].map(planet => ({
    ...planet,
    initialAngle: Math.random() * 2 * Math.PI,
}));

const SCALING_FACTOR = {
    radius: 12,
    distance: 10,
};

// --- Helper & Factory Functions ---

// (createCelestialBody and createLighting are unchanged)
function createCelestialBody(bodyData, textureLoader) {
    const { name, radius, color } = bodyData;
    const isSun = name === 'sun';
    const geometry = new THREE.SphereGeometry(radius / SCALING_FACTOR.radius, 32, 32);
    const material = isSun
        ? new THREE.MeshBasicMaterial()
        : new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            metalness: 0.1,
            roughness: 0.8,
        });
    const mesh = new THREE.Mesh(geometry, material);
    if (!isSun) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
    }
    textureLoader.load(
        `/${name}.jpg`,
        (texture) => {
            material.map = texture;
            material.color.set(0xffffff);
            material.needsUpdate = true;
        },
        undefined,
        () => {
            console.error(`Failed to load texture for ${name}. Falling back to color.`)
            material.color.set(color)
        }
    )
    return mesh
}

function createLighting() {
    const lightGroup = new THREE.Group()
    const sunLight = new THREE.PointLight(0xffffff, 500, 0)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 2048
    sunLight.shadow.mapSize.height = 2048
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25)
    lightGroup.add(sunLight, ambientLight)
    return lightGroup
}

/**
 * @param {number} distance
 * @returns {THREE.LineLoop}
 */
function createOrbit(distance) {
    const points = []
    const radius = distance / SCALING_FACTOR.distance
    const segments = 128
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2
        points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0))
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
    })
    
    return new THREE.LineLoop(geometry, material)
}

/**
 * @returns {THREE.Points}
 */
function createStars() {
    const starVertices = []
    for (let i = 0; i < 10000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000)
        const y = THREE.MathUtils.randFloatSpread(2000)
        const z = THREE.MathUtils.randFloatSpread(2000)
        starVertices.push(x, y, z)
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
    });

    return new THREE.Points(geometry, material);
}


// --- React Component ---

const SolarSystem = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;

        // --- Core Scene Setup ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            75,
            currentMount.clientWidth / currentMount.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 50;
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        currentMount.appendChild(renderer.domElement);
        
        // --- Add Objects to the Scene ---
        const textureLoader = new THREE.TextureLoader();
        scene.add(createLighting());
        // 3. Add stars and orbits to the scene
        scene.add(createStars());

        const celestialBodies = SOLAR_SYSTEM_DATA.map(data => {
            const body = createCelestialBody(data, textureLoader);
            body.position.x = data.distance / SCALING_FACTOR.distance;
            scene.add(body);
            
            // Add an orbit for every planet, but not the sun
            if (data.name !== 'sun') {
                const orbit = createOrbit(data.distance);
                scene.add(orbit);
            }
            
            return body;
        });

        // --- Camera Controls, Animation, and Cleanup (Unchanged) ---
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 20;
        controls.maxDistance = 200;

        let clock = new THREE.Clock();
        let animationFrameId;
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            celestialBodies[0].rotation.y += 0.001;
            celestialBodies.forEach((body, index) => {
                if (index === 0) return;
                const data = SOLAR_SYSTEM_DATA[index];
                body.rotation.y += 0.005;
                const angle = elapsedTime * data.speed * 0.1 + data.initialAngle;
                body.position.x = Math.cos(angle) * (data.distance / SCALING_FACTOR.distance);
                body.position.y = Math.sin(angle) * (data.distance / SCALING_FACTOR.distance);
            });

            controls.update();
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => {
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (currentMount) {
                currentMount.removeChild(renderer.domElement);
            }
            cancelAnimationFrame(animationFrameId);
            controls.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div 
            ref={mountRef} 
            style={{ width: '100vw', height: '100vh', display: 'block' }} 
        />
    );
};

export default SolarSystem;