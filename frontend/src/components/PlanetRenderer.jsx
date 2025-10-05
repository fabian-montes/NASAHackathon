import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import sunTexture from '../assets/sun.jpg';
import mercuryTexture from '../assets/8k_mercury.jpg';
import venusTexture from '../assets/8k_venus.jpg';
import earthTexture from '../assets/8k_earth.jpg';
import marsTexture from '../assets/8k_mars.jpg';
import jupiterTexture from '../assets/8k_jupiter.jpg';
import saturnTexture from '../assets/8k_saturn.jpg';
import uranusTexture from '../assets/uranus.jpg';
import neptuneTexture from '../assets/neptune.jpg';

const TEXTURES = {
    sun: sunTexture,
    mercury: mercuryTexture,
    venus: venusTexture,
    earth: earthTexture,
    mars: marsTexture,
    jupiter: jupiterTexture,
    saturn: saturnTexture,
    uranus: uranusTexture,
    neptune: neptuneTexture,
};

const SOLAR_SYSTEM_DATA = [
    { name: 'sun', radius: 40, color: 0xffa500 },
    { name: "mercury", radius: 4, color: 0x8c7853 },
    { name: "venus", radius: 7, color: 0xffc649 },
    { name: "earth", radius: 8, color: 0x2233ff },
    { name: "mars", radius: 6, color: 0xcd5c5c },
    { name: "jupiter", radius: 20, color: 0xc88b3a },
    { name: "saturn", radius: 17, color: 0xfad5a5 },
    { name: "uranus", radius: 12, color: 0x4fd0e0 },
    { name: "neptune", radius: 12, color: 0x4166f5 },
];

function createCelestialBody(bodyData, textureLoader) {
    const { name, color } = bodyData;
    const isSun = name === 'sun';
    const geometry = new THREE.SphereGeometry(30, 512, 512);
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
    textureLoader.load(TEXTURES[name],
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
    const lightGroup = new THREE.Group();
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(10, 5, 20); 
    directionalLight.castShadow = true;
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    lightGroup.add(directionalLight, ambientLight);
    return lightGroup;
}

const PlanetRenderer = ({ planet }) => {
    console.log('Planet to render:', planet);
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            currentMount.clientWidth / currentMount.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 80;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setClearColor(0x000000, 0);
        currentMount.appendChild(renderer.domElement);
        
        const textureLoader = new THREE.TextureLoader();
        scene.add(createLighting());

        const filteredData = SOLAR_SYSTEM_DATA.filter(p => p.name === planet.toLowerCase());
        const celestialBodies = filteredData.map(data => {
            const body = createCelestialBody(data, textureLoader);
            body.position.set(0, 0, 0);
            scene.add(body);
            return body;
        });

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 20;
        controls.maxDistance = 200;

        let animationFrameId;
        const animate = () => {
            celestialBodies.forEach(body => {
                body.rotation.y += 0.005;
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
    }, [planet]);

    return (
        <div 
            ref={mountRef} 
            style={{ width: '50vw', height: '67vh', display: 'block', border: '1px solid limegreen' }} 
        />
    );
};

export default PlanetRenderer