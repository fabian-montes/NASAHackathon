import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MidSystem = () => {
    const containerRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current) return

        console.log('🚀 Starting TinySystem with textures...');

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        console.log('✅ Scene created');

        // Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 50;
        console.log('✅ Camera created at z=50');

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        containerRef.current.appendChild(renderer.domElement);
        console.log('✅ Renderer created and mounted');

        // Texture loader
        const textureLoader = new THREE.TextureLoader();

        const SEGMENTS = 32;

        const planetsData = retrievePlanetsData();

        // Create sun and lights first
        const sunTexture = textureLoader.load('/sun.jpg');
        const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
        const sun = new THREE.Mesh(new THREE.SphereGeometry(4, 32, 32), sunMaterial);
        scene.add(sun);
        
        // Configure light for shadows
        const sunLight = new THREE.PointLight(0xffffff, 500, 0);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 500;
        scene.add(sunLight);
        
        // Add ambient light so planets aren't completely black on the dark side
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
        scene.add(ambientLight);

        // Create planets array with sun first
        const PLANETS = [sun];

        // Create planets (skip index 0 which is sun data)
        for (let i = 1; i < planetsData.length; i++) {
            const p = planetsData[i];
            
            // Create material with bright white to see them immediately
            const material = new THREE.MeshStandardMaterial({ 
                color: 0xaaaaaa, // Light gray - visible but won't heavily tint texture
                metalness: 0.1,
                roughness: 0.8
            });
            
            const geometry = new THREE.SphereGeometry(p.radius / 12, SEGMENTS, SEGMENTS);
            const mesh = new THREE.Mesh(geometry, material);

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            scene.add(mesh);

            // Set initial position
            mesh.position.set(p.distance / 10, 0, 0);

            PLANETS.push(mesh);

            // Load texture asynchronously
            console.log(`📦 Loading texture: /${p.name}.jpg ...`);
            textureLoader.load(
                `/${p.name}.jpg`,
                (texture) => {
                    console.log(`✅ SUCCESS ${p.name}.jpg loaded for ${p.name}!`);
                    mesh.material.map = texture;
                    mesh.material.color.set(0xffffff); // Set to white when texture loads
                    mesh.material.needsUpdate = true;
                    console.log(`✅ Texture applied to ${p.name}, map exists:`, mesh.material.map !== null);
                },
                undefined,
                (error) => {
                    console.error(`❌ FAILED to load ${p.name}.jpg`, error);
                    console.log(`Using color fallback for ${p.name}`);
                    mesh.material.color.set(p.color); // Only use color if texture fails
                }
            );
        }

        // Animation
        let angle = 0;
        let frameCount = 0;

        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate sun
            PLANETS[0].rotation.y += 0.01;

            PLANETS.forEach((p, i) => {
                if (i === 0) {
                    p.rotation.y += 0.01;
                } else {
                    // Rotate and translate 
                    p.rotation.y += 0.02;
                    p.position.x = Math.cos((angle + planetsData[i].deviation) * planetsData[i].speed * 5) * planetsData[i].distance / 10;
                    p.position.y = Math.sin((angle + planetsData[i].deviation) * planetsData[i].speed * 5) * planetsData[i].distance / 10;
                }
            });

            angle += 0.02;

            renderer.render(scene, camera);

            // Log every 60 frames to confirm animation is running
            frameCount++;
            if (frameCount % 60 === 0) {
                console.log(`🎬 Frame ${frameCount}: angle=${angle.toFixed(2)}`);
            }
        };

        console.log('🎬 Starting animation loop...');
        animate();

        // Resize handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            console.log('🧹 Cleaning up...');
            window.removeEventListener('resize', handleResize);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
            <div
                ref={containerRef}
                style={{
                    width: '100vw',
                    height: '100vh',
                    margin: 0,
                    padding: 0,
                    display: 'block'
                }}
            />
        </div>
    );
};

function getRandomDeviation() {
    return Math.random() * 2 * Math.PI;
}

function retrievePlanetsData() {
    return [
        { name: 'sun', radius: 40, distance: 0, speed: 1, color: 0xff0000 },
        { name: "mercury", radius: 4, distance: 60, speed: 1 / 1, color: 0x8c7853, deviation: getRandomDeviation() },
        { name: "venus", radius: 7, distance: 90, speed: 1 / 2.55, color: 0xffc649, deviation: getRandomDeviation() },
        { name: "earth", radius: 8, distance: 120, speed: 1 / 4.15, color: 0x2233ff, deviation: getRandomDeviation() },
        { name: "mars", radius: 6, distance: 150, speed: 1 / 7.81, color: 0xcd5c5c, deviation: getRandomDeviation() },
        { name: "jupiter", radius: 20, distance: 210, speed: 1 / 49, color: 0xc88b3a, deviation: getRandomDeviation() },
        { name: "saturn", radius: 17, distance: 270, speed: 1 / 122, color: 0xfad5a5, deviation: getRandomDeviation() },
        { name: "uranus", radius: 12, distance: 330, speed: 1 / 348, color: 0x4fd0e0, deviation: getRandomDeviation() },
        { name: "neptune", radius: 12, distance: 380, speed: 1 / 684, color: 0x4166f5, deviation: getRandomDeviation() },
    ];
}

export default MidSystem;